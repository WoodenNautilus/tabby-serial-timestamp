// import { Injectable } from '@angular/core'
import { distinctUntilChanged, map } from 'rxjs'
import { SessionMiddleware } from 'tabby-terminal'
import { Logger, ConfigService } from 'tabby-core'


// [dd/mm/yyyy hh:mm:ss:zzz]
// const DateOverhead = 26
const None = 'None'
const ISO = 'ISO 8601'
const Europe = 'dd/mm/yyyy hh:mm:ss.SSS'
const US = 'mm/dd/yyyy hh:mm:ss.SSS'

// @Injectable()
export class SerialTimestampMiddleware extends SessionMiddleware {
    private logger: Logger
    private firstCall: Boolean
    private formatChanged: Boolean
    private currentTimestampType: string

    constructor (
        private config: ConfigService,
        parentLogger: Logger
    ) {
        super()
        this.firstCall = true
        this.formatChanged = false
        this.currentTimestampType = this.config.store.serialTimestampPlugin.timestamp

        this.config.changed$.pipe(
            map(() => this.config.store.serialTimestampPlugin.timestamp),
            distinctUntilChanged(),
        ).subscribe(() => this.updateTimestampType())

        this.logger = parentLogger
        // this.logger.info(`Middleware created`)
    }


    feedFromSession (data: Buffer): void {
        let currentDate: String
        let newData: Buffer

        // this.logger.info(`data hex: ${data.toString('hex')}`)
        // this.logger.info(`data utf8: ${data.toString('utf8')}`)

        if(this.firstCall === true) {
            // this.logger.info(`first call to feedFromSession`)

            currentDate = this.getDate()

            if(currentDate !== "") {
                newData = Buffer.concat([Buffer.from("["), Buffer.from(currentDate), Buffer.from("] ")])
                this.outputToTerminal.next(newData)
            }

            this.firstCall = false
        }
        else if(this.formatChanged === true)
        {
            // this.logger.info(`first call to feedFromSession after timestamp format changed`)
            
            currentDate = this.getDate()

            if(currentDate !== "") {
                // Add a line feed to allow new data to be displaed without any date in front
                newData = Buffer.concat([Buffer.from("\n"), Buffer.from("["), Buffer.from(currentDate), Buffer.from("] ")])
                this.outputToTerminal.next(newData)
            }
            else
            {
                // Add a line feed to allow new data to be displaed without any date in front
                this.outputToTerminal.next(Buffer.from("\n"))
            }

            this.formatChanged = false
        }

        // Original line for CR|LF: /\r|\n/.exec()
        if(/\n/.exec(data.toString('utf8'))) {
            // this.logger.info(`data contains LF or CR`)
            
            currentDate = this.getDate()

            if(currentDate !== "") {
                for (const line of data.toString('utf8').split('\n')) {
                    if(line.length > 0) {
                        newData = Buffer.concat([Buffer.from(line), Buffer.from("\n"), Buffer.from("["), Buffer.from(currentDate), Buffer.from("] ")])
                        
                        // this.logger.info(`newData hex: ${newData.toString('hex')}`)
                        // this.logger.info(`newData utf8: ${newData.toString('utf8')}`)
                        
                        this.outputToTerminal.next(newData)
                    }
                }
            }
            else
            {
                // this.logger.info(`no date to prepend`)
                this.outputToTerminal.next(data)
            }
        }
        else {
            // this.logger.info(`data DOESN'T contain LF`)
            this.outputToTerminal.next(data)
        }
    }

    close (): void {
        // this.logger.info(`Middleware closing`)
        super.close()
    }

    private updateTimestampType () {
        this.currentTimestampType = this.config.store.serialTimestampPlugin.timestamp
        this.formatChanged = true // set to true to make sur the date is added before the new data
        this.logger.info(`Serial timestamp changed to ${this.currentTimestampType}`)
    }

    private getDate (): String {
        let sDate: String = new String("")
        let date: Date

        switch(this.currentTimestampType) {
            case None:
                sDate = ""
                break;
            case ISO:
                date =  new Date()
                sDate = date.toISOString()
                break;
            case Europe:
                date = new Date()
            
                sDate = sDate.concat(date.getDate().toString(10), "/", date.getMonth().toString(10), "/", date.getFullYear().toString(10), "/",
                                        date.getHours().toString(10), ":", date.getMinutes().toString(10), ":", date.getSeconds().toString(10), ".",date.getMilliseconds().toString(10))
                
                // this.logger.info(`Date created ${sDate}`)
                break;
            case US:
                date = new Date()

                sDate = sDate.concat(date.getMonth().toString(10), "/", date.getDate().toString(10), "/", date.getFullYear().toString(10), "/",
                                        date.getHours().toString(10), ":", date.getMinutes().toString(10), ":", date.getSeconds().toString(10), ".",date.getMilliseconds().toString(10))
                
                break;
            default:
                this.logger.error(`Unknown type ${this.currentTimestampType}`)
                sDate = ""
        }

        return sDate
    }
}