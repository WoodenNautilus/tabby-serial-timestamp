import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'

/** @hidden */
@Component({
    template: require('./settingsTab.component.pug'),
})
export class SerialTimestampSettingsTabComponent {
    timestamps = [
        'None',
        'dd/mm/yy hh:mm:ss',
        'mm/dd/yy hh:mm:ss',
    ]

    constructor (
        public config: ConfigService,
    ) { }
}
