import { Injectable } from '@angular/core'
// import { bufferTime } from 'rxjs'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'
import { Logger, LogService, ConfigService } from 'tabby-core'
import { SerialTimestampMiddleware } from './sessionMiddleware'


@Injectable()
export class SerialTimestampDecorator extends TerminalDecorator {
    logger: Logger
    config: ConfigService

    constructor (
        configService: ConfigService,
        log: LogService
    ) {
        super()
        this.logger = log.create('serial-timestamp')
        this.config = configService
    }

    attach (terminal: BaseTerminalTabComponent<any>): void {
        // Will be done this way once a new version of the tabby* plugins is released
        // if(terminal.profile instanceof SerialTabComponent) {
        // }

        if(terminal.constructor.name === 'SerialTabComponent') {
            // this.logger.info(`Terminal is of type SerialTabComponent`)

            terminal.sessionChanged$.subscribe(session => {
                if (session) {
                    this.attachToSession(terminal)
                }
            })
            if (terminal.session) {
                this.attachToSession(terminal)
            }
        }
        else {
            // this.logger.info(`Terminal is NOT of type SerialTabComponent`)
            
            return
        }
    }

    // detach (terminal: BaseTerminalTabComponent<any>): void {
    //     this.logger.info(`Detaching from session: ${terminal.title}`)
    // }

    private attachToSession (terminal: BaseTerminalTabComponent<any>) {
        if (!terminal.session) {
            this.logger.warn(`Session is empty !`)
            return
        }

        // this.logger.info(`Attaching to session: ${terminal.title}`)
        
        terminal.session.middleware.push(new SerialTimestampMiddleware(this.config, this.logger))
    }
}
