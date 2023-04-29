// import { Injectable } from '@angular/core'
import { SessionMiddleware } from 'tabby-terminal'
import { Logger } from 'tabby-core'


// [dd/mm/yyyy hh:mm:ss:zzz]
// const DateOverhead = 26

// @Injectable()
export class SerialTimestampMiddleware extends SessionMiddleware {
    private logger: Logger
    private firstCall: Boolean

    constructor (parentLogger: Logger) {
        super()
        this.firstCall = true
        this.logger = parentLogger
        this.logger.info(`Middleware created`)
    }


    feedFromSession (data: Buffer): void {
        this.logger.info(`data hex: ${data.toString('hex')}`)
        this.logger.info(`data utf8: ${data.toString('utf8')}`)

        if(this.firstCall === true) {
            this.logger.info(`first call to feedFromSession`)
            this.outputToTerminal.next(Buffer.from("[timestamp] "))
            this.firstCall = false
        }
        // Original line for CR|LF: /\r|\n/.exec()
        if(/\n/.exec(data.toString('utf8'))) {
            this.logger.info(`data contains LF or CR`)
            for (const line of data.toString('utf8').split('\n')) {
                if(line.length > 0) {
                    // let date: Date = new Date();
                    // newData = Buffer.concat([Buffer.from(date.toISOString(), "utf-8"), data], data.length + DateOverhead)
                    let newData = Buffer.concat([Buffer.from(line), Buffer.from("\n"), Buffer.from("[timestamp] ")])
                    
                    this.logger.info(`newData hex: ${newData.toString('hex')}`)
                    this.logger.info(`newData utf8: ${newData.toString('utf8')}`)
                    this.outputToTerminal.next(newData)
                }
            }
        }
        else {
            // this.logger.info(`data DOESN'T contain LF`)
            this.outputToTerminal.next(data)
        }
    }

    // feedFromSession (data: Buffer): void {
    //     for (const line of data.toString().split('\n')) {
    //         const formatted = `[${new Date().toLocaleTimeString()}] ${line}\n`
    //         this.outputToTerminal.next(Buffer.from(formatted))
    //     }
    // }

    close (): void {
        this.logger.info(`Middleware closing`)
        super.close()
    }
}