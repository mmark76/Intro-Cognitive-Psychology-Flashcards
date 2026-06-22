export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("el-CY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
