import { Injectable } from '@angular/core'
// import { bufferTime } from 'rxjs'
import { TerminalDecorator, BaseTerminalTabComponent, BaseSession, SessionMiddleware} from 'tabby-terminal'
import { SerialTimestampSessionMiddleware } from './sessionMiddleware'

@Injectable()
export class SerialTimestampDecorator extends TerminalDecorator {
    constructor (
        ) {
        super()
    }

    attach (terminal: BaseTerminalTabComponent): void {
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

    private attachToSession (terminal: BaseTerminalTabComponent) {
        // session.output$.subscribe(data => {
        //     if (data.includes('command not found')) {
        //         this.clippy.speak('It looks like you\'ve typed in an incorrect command. Consider typing in a correct command instead.')
        //     }
        // })
        terminal.session.middleware.push(new SerialTimestampSessionMiddleware())
    }
}
