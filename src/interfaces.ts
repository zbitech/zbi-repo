
export interface Database {
    init(): Promise<void>;
    connect(): Promise<void>;
    close(): Promise<void>;
    clear(): Promise<void>;
}
  