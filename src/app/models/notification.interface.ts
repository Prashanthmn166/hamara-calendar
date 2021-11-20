export interface NotificationModel {
    title: string,
    body: string,
    id: string,
    schedule:  {
        at: Date,
        count?: number
    }
}