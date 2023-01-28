export interface LogLine {
  key: string
  type: "EggEvent" | "TransactionEvent"
  id: number,
  date: Date,
  note: string
  amount: number
}
