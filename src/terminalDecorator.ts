import { Injectable } from '@angular/core'
// import { bufferTime } from 'rxjs'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'
import { Logger, LogService } from 'tabby-core'
import { SerialTimestampMiddleware } from './sessionMiddleware'

@Injectable()
export class SerialTimestampDecorator extends TerminalDecorator {
    logger: Logger

    constructor (log: LogService) {
        super()
        this.logger = log.create('serial-timestamp')  
    }

    attach (terminal: BaseTerminalTabComponent<any>): void {
        // tab.input$.pipe(bufferTime(3000)).subscribe((buffers: Buffer[])  => {
            // if (Buffer.concat(buffers).toString().includes('ls\r')) {
            //     this.clippy.speak('It looks like you\'re using the "ls" command. Did you know that you can use it to list files?')
            // }
        // })
        terminal.sessionChanged$.subscribe(session => {
            if (session) {
                this.attachToSession(terminal)
            }
        })
        if (terminal.session) {
            this.attachToSession(terminal)
        }
    }

    detach (terminal: BaseTerminalTabComponent<any>): void {
        this.logger.info(`Detaching from session: ${terminal.title}`)
    }

    private attachToSession (terminal: BaseTerminalTabComponent<any>) {
        // session.output$.subscribe(data => {
        //     if (data.includes('command not found')) {
        //         this.clippy.speak('It looks like you\'ve typed in an incorrect command. Consider typing in a correct command instead.')
        //     }
        // })
        if (!terminal.session) {
            this.logger.info(`Session is empty !`)
            return
        }
        this.logger.info(`Attaching to session: ${terminal.title}`)
        terminal.session.middleware.push(new SerialTimestampMiddleware(this.logger))
    }
}
