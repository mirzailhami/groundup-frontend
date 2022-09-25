export interface Anomaly {
    _id: string;
    timestamp: number;
    machine: string;
    anomaly: string;
    sensor: string;
    soundClip: string;
    comments?: string;
}
