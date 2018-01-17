export class Notification {
    public id: number;
    public title: string;
    public description: string;
    public created_at: string;
    public url: string;

    constructor(obj ?: any) {
        this.id = obj && obj.id || null;
        this.title = obj && obj.title || '';
        this.description = obj && obj.description || '';
        this.created_at = obj && obj.created_at || '';
        this.url = obj && obj.url || null;
    }
}
