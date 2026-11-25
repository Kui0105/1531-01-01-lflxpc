import { ElMessage } from 'element-plus'

/**
 * 将表格数据导出为 CSV 文件（带 BOM，兼容 Excel 中文）
 * @param filename 文件名（不含日期与扩展名）
 * @param headers 表头
 * @param rows 数据行
 */
export function exportCsv(
    filename: string,
    headers: string[],
    rows: Array<Array<string | number>>
) {
    const csv = [headers, ...rows]
        .map((row) =>
            row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
        )
        .join('\n')
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
}
