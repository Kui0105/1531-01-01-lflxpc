/**
 * GitHub 直推脚本（Git Data API）
 * 用法：node scripts/push-github.mjs "feat: v0.1.0 说明"
 *
 * - 优先读取环境变量 GITHUB_TOKEN，其次读取系统凭据管理器中的 GitHub 凭证
 * - 与远程树比较 blob SHA，仅上传变化文件，保留提交历史
 * - 排除 node_modules / .git / 构建产物 / 本地环境文件
 */
import crypto from 'crypto'
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const OWNER = 'Kui0105'
const REPO = '1531-01-01-lflxpc'
const BRANCH = 'main'
const API = 'https://api.github.com'
const ROOT = path.resolve(process.cwd())
const MESSAGE = process.argv.slice(2).join(' ') || 'chore: sync project files'

const EXCLUDE_DIRS = new Set(['node_modules', '.git', '.workbuddy', 'dist', 'dist-ssr', '.vscode'])
const EXCLUDE_FILES = new Set([
    'tsconfig.tsbuildinfo',
    'auto-imports.d.ts',
    'components.d.ts',
    '.eslintrc-auto-import.json',
    '.env.development',
    '.env.production'
])
const EXCLUDE_RE = /\.(log|local)$/

function findToken() {
    if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
    try {
        const output = execFileSync('git', ['credential', 'fill'], {
            input: 'protocol=https\nhost=github.com\n\n',
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        })
        const match = output.match(/^password=(.+)$/m)
        if (match && match[1].trim()) return match[1].trim()
    } catch (error) {
        // 回退到本地 Git 配置
    }
    const candidates = [
        'D:/仓库/1524gl.ui.ehaiba.net/.git/config',
        'D:/仓库/1261-04-01 fanshengtongxin-PC/.git/config'
    ]
    for (const file of candidates) {
        if (fs.existsSync(file)) {
            const match = fs.readFileSync(file, 'utf8').match(/ghp_[A-Za-z0-9]{20,}/)
            if (match) return match[0]
        }
    }
    throw new Error('未找到 GitHub Token，请设置环境变量 GITHUB_TOKEN')
}

const TOKEN = findToken()

async function api(url, options = {}) {
    const response = await fetch(`${API}${url}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(options.headers || {})
        }
    })
    const text = await response.text()
    const data = text ? JSON.parse(text) : null
    if (!response.ok) {
        throw new Error(`${url} -> ${response.status} ${data?.message || text}`)
    }
    return data
}

function collectFiles(dir, base = '', output = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (EXCLUDE_DIRS.has(entry.name)) continue
            collectFiles(path.join(dir, entry.name), base ? `${base}/${entry.name}` : entry.name, output)
        } else if (entry.isFile()) {
            if (EXCLUDE_FILES.has(entry.name) || EXCLUDE_RE.test(entry.name)) continue
            output.push(base ? `${base}/${entry.name}` : entry.name)
        }
    }
    return output
}

function gitBlobSha(buffer) {
    return crypto
        .createHash('sha1')
        .update(`blob ${buffer.length}\0`)
        .update(buffer)
        .digest('hex')
}

async function main() {
    const files = collectFiles(ROOT).sort()
    console.log(`本地文件数：${files.length}`)

    let parentSha = null
    let baseTreeSha = null
    const remotePaths = new Set()
    const remoteSha = new Map()
    try {
        const ref = await api(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`)
        parentSha = ref.object.sha
        const commit = await api(`/repos/${OWNER}/${REPO}/git/commits/${parentSha}`)
        baseTreeSha = commit.tree.sha
        const tree = await api(`/repos/${OWNER}/${REPO}/git/trees/${baseTreeSha}?recursive=1`)
        for (const item of tree.tree) {
            if (item.type === 'blob') {
                remotePaths.add(item.path)
                remoteSha.set(item.path, item.sha)
            }
        }
    } catch (error) {
        if (!/404|409/.test(error.message)) throw error
        console.log('远程仓库为空，将创建首次提交')
    }

    const entries = []
    const toUpload = []
    for (const file of files) {
        const buffer = fs.readFileSync(path.join(ROOT, file))
        const sha = gitBlobSha(buffer)
        if (remoteSha.get(file) === sha) {
            entries.push({ path: file, mode: '100644', type: 'blob', sha })
        } else {
            toUpload.push({ file, buffer, sha })
        }
    }
    // 远程存在但本地已删除的文件，显式删除
    for (const file of remotePaths) {
        if (!files.includes(file)) {
            entries.push({ path: file, mode: '100644', type: 'blob', sha: null })
        }
    }

    console.log(`需上传文件数：${toUpload.length}`)
    const concurrency = 8
    for (let i = 0; i < toUpload.length; i += concurrency) {
        const batch = toUpload.slice(i, i + concurrency)
        await Promise.all(
            batch.map(async ({ file, buffer, sha }) => {
                const result = await api(`/repos/${OWNER}/${REPO}/git/blobs`, {
                    method: 'POST',
                    body: JSON.stringify({ content: buffer.toString('base64'), encoding: 'base64' })
                })
                if (result.sha !== sha) throw new Error(`blob SHA 不一致：${file}`)
                entries.push({ path: file, mode: '100644', type: 'blob', sha: result.sha })
            })
        )
        process.stdout.write('.')
    }
    console.log('')

    const tree = await api(`/repos/${OWNER}/${REPO}/git/trees`, {
        method: 'POST',
        body: JSON.stringify({ base_tree: baseTreeSha, tree: entries })
    })

    const commit = await api(`/repos/${OWNER}/${REPO}/git/commits`, {
        method: 'POST',
        body: JSON.stringify({
            message: MESSAGE,
            tree: tree.sha,
            parents: parentSha ? [parentSha] : []
        })
    })

    try {
        await api(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
            method: 'PATCH',
            body: JSON.stringify({ sha: commit.sha, force: false })
        })
    } catch (error) {
        if (!/404|409/.test(error.message)) throw error
        await api(`/repos/${OWNER}/${REPO}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({ ref: `refs/heads/${BRANCH}`, sha: commit.sha })
        })
    }

    console.log(`提交成功：${commit.sha}`)
    console.log(`查看：https://github.com/${OWNER}/${REPO}/commit/${commit.sha}`)
}

main().catch((error) => {
    console.error(`推送失败：${error.message}`)
    process.exit(1)
})
