export interface LogLine {
  key: string
  type: "EggEvent" | "Transaction"
  id: number,
  date: Date,
  note: string
  amount: number
}
