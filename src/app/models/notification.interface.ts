export interface NotificationModel {
    title: string,
    body: string,
    id: number,
    schedule:  {
        at: Date,
        count?: number
    }
}