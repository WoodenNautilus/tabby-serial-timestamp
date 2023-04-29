import { ConfigProvider } from 'tabby-core'

/** @hidden */
export class SerialTimestampConfigProvider extends ConfigProvider {
    defaults = {
        serialTimestampPlugin: {
            timestamp: 'None',
        }
    }
}
