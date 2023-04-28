// import { Injectable } from '@angular/core'
import { SessionMiddleware } from 'tabby-terminal'

// [dd/mm/yyyy hh:mm:ss:zzz]
// const DateOverhead = 26

// @Injectable()
export class SerialTimestampSessionMiddleware extends SessionMiddleware {
    // feedFromSession (data: Buffer): void {
        // let date: Date = new Date();
        // let newData: Buffer = Buffer.alloc(data.length + DateOverhead);
        // newData = Buffer.concat([Buffer.from(date.toISOString(), "utf-8"), data])
        // super.feedFromSession(newData)
    // }

    feedFromSession (data: Buffer): void {
        for (const line of data.toString().split('\n')) {
            const formatted = `[${new Date().toLocaleTimeString()}] ${line}\n`
            this.outputToTerminal.next(Buffer.from(formatted))
        }
    }

    close (): void {
        // super.close()
    }
}