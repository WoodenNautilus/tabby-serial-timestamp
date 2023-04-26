import SessionMiddleware from 'tabby-core'

// [dd/mm/yyyy hh:mm:ss:zzz]
// const DateOverhead = 26

export class SerialTimestampSessionMiddleware extends SessionMiddleware {
    // feedFromSession (data: Buffer): void {
        // let date: Date = new Date();
        // let newData: Buffer = Buffer.alloc(data.length + DateOverhead);
        // newData = Buffer.concat([Buffer.from(date.toISOString(), "utf-8"), data])
        // super.feedFromSession(newData)
    // }

    close (): void {
        // super.close()
    }
}