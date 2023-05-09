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
    private startOfLine: Boolean
    private formatChanged: Boolean
    private currentTimestampFormat: string

    constructor(
        private config: ConfigService,
        parentLogger: Logger
    ) {
        super()
        this.startOfLine = true
        this.formatChanged = false
        this.currentTimestampFormat = this.config.store.serialTimestampPlugin.timestamp

        this.config.changed$.pipe(
            map(() => this.config.store.serialTimestampPlugin.timestamp),
            distinctUntilChanged(),
        ).subscribe(() => this.updateTimestampFormat())

        this.logger = parentLogger
        // this.logger.info(`Middleware created`)
    }


    feedFromSession(data: Buffer): void {
        let currentDate: String
        let newData: Buffer
        let occurences: number
        let line: String
        let strRemaining: String
        // let str: String

        // this.logger.info(`-------------------------- Entering feedFromSession --------------------------`)

        // this.logger.info(`data hex: ${data.toString('hex')}`)
        // this.logger.info(`data utf8: ${data.toString('utf8')}`)

        // str = 'Provided data '
        // data.forEach((char) => {
        //     str = str + '0x' + char.toString(16) + ' '
        // })

        // this.logger.info(`Provided string ${data.toString('utf8')}`)
        // this.logger.info(`${str}`)

        currentDate = this.getDate()

        if (currentDate !== "") {
            // split always return an empty string if it did not found the required string/char
            // occurences is set to 1 when LF was not found to force the for loop once
            occurences = data.toString('utf8').split('\n').length > 1 ? data.toString('utf8').split('\n').length-1 : data.toString('utf8').split('\n').length
            strRemaining = data.toString('utf8')
            
            // this.logger.info(`occurences ${occurences}`)
            // this.logger.info(`data.toString('utf8').split(CRLF OR LF).length ${data.toString('utf8').split(/\r\n|\n/).length}`)
            // this.logger.info(`data.toString('utf8').length ${data.toString('utf8').length}`)

            for (let i = 0; i < occurences; i++) {
                // this.logger.info(`Loop number ${i}`)
                // Original line for CR|LF: /\r|\n/.exec()
                if (/\n/.exec(strRemaining.toString())) {
                    // this.logger.info(`Remaining data contains LF`)
                    line = strRemaining.substring(0, strRemaining.indexOf("\n") + 1)
                    strRemaining = strRemaining.substring(strRemaining.indexOf("\n") + 1)
                }
                else {
                    // this.logger.info(`Remaining data does not contain LF`)
                    line = strRemaining
                    strRemaining = null
                }

                // this.logger.info(`line ${line}`)
                // str = 'line data '
                // Buffer.from(line, 'utf8').forEach((char) => {
                //     str = str + '0x' + char.toString(16) + ' '
                // })
                // this.logger.info(`${str}`)

                // if(strRemaining) {
                //     this.logger.info(`strRemaining ${strRemaining}`)
                //     str = 'strRemaining data '
                //     Buffer.from(strRemaining, 'utf8').forEach((char) => {
                //         str = str + '0x' + char.toString(16) + ' '
                //     })
                //     this.logger.info(`${str}`)
                // }

                if (this.startOfLine === true || this.formatChanged === true) {
                    // this.logger.info(`line is the beginning of the line thus prepend the date`)
                    newData = Buffer.concat([Buffer.from("["), Buffer.from(currentDate), Buffer.from("] "), Buffer.from(line)])

                    this.outputToTerminal.next(newData)

                    if (this.startOfLine === true) {
                        // this.logger.info(`Unsetting startOfLine`)
                        this.startOfLine = false
                    }

                    if (this.formatChanged === true) {
                        // this.logger.info(`Unsetting formatChanged`)
                        this.formatChanged = false
                    }
                }
                else {
                    // this.logger.info(`line is not the beginning of the line. Do not  prepend the date`)
                    this.outputToTerminal.next(Buffer.from(line))
                }

                // If line contains \n or if it ends with \r
                if (/\n/.exec(line.toString()) || line.charAt(line.length - 1) === '\r') {
                    // this.logger.info(`line contains LF thus setting startOfLine`)
                    this.startOfLine = true
                }

                // Last string does not contains \n, thus, must be output because for loop will not
                // reach it
                if (strRemaining && strRemaining.length > 0 && /\n/.exec(strRemaining.toString()) === null) {
                    // this.logger.info(`Last string does not contains LF`)
                    newData = Buffer.concat([Buffer.from("["), Buffer.from(currentDate), Buffer.from("] "), Buffer.from(strRemaining)])

                    this.outputToTerminal.next(newData)
                    
                    if (strRemaining.charAt(strRemaining.length - 1) === '\r') {
                        this.startOfLine = true
                    }
                    else {
                        this.startOfLine = false
                    }
                }
            }
        }
        else { // Timestamp format is "None"
            this.outputToTerminal.next(data)
        }

        // this.logger.info(`-------------------------- Leaving feedFromSession --------------------------`)
    }

    close(): void {
        // this.logger.info(`Middleware closing`)
        super.close()
    }

    private updateTimestampFormat() {
        this.currentTimestampFormat = this.config.store.serialTimestampPlugin.timestamp
        this.formatChanged = true // set to true to make sur the date is added before the new data
        this.logger.info(`Serial timestamp changed to ${this.currentTimestampFormat}`)
    }

    private getDate(): String {
        let sDate: String = new String("")
        let date: Date

        switch (this.currentTimestampFormat) {
            case None:
                sDate = ""
                break;
            case ISO:
                date = new Date()
                sDate = date.toISOString()
                break;
            case Europe:
                date = new Date()

                sDate = sDate.concat(date.getDate().toString(10).padStart(2, "0"), "/", (date.getMonth() + 1).toString(10).padStart(2, "0"), "/", date.getFullYear().toString(10), " ",
                    date.getHours().toString(10).padStart(2, "0"), ":", date.getMinutes().toString(10).padStart(2, "0"), ":", date.getSeconds().toString(10).padStart(2, "0"), ".", date.getMilliseconds().toString(10).padStart(3, "0"))

                // this.logger.info(`Date created ${sDate}`)
                break;
            case US:
                date = new Date()

                sDate = sDate.concat((date.getMonth() + 1).toString(10).padStart(2, "0"), "/", date.getDate().toString(10).padStart(2, "0"), "/", date.getFullYear().toString(10), " ",
                    date.getHours().toString(10).padStart(2, "0"), ":", date.getMinutes().toString(10).padStart(2, "0"), ":", date.getSeconds().toString(10).padStart(2, "0"), ".", date.getMilliseconds().toString(10).padStart(3, "0"))

                break;
            default:
                this.logger.error(`Unknown format ${this.currentTimestampFormat}`)
                sDate = ""
        }

        return sDate
    }
}