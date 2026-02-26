import React from 'react'
import { CHANNELS } from '../channelConfig'

export default function ChannelSwitcher({ currentChannel, onChannelChange }) {
    const channelList = Object.values(CHANNELS)

    return (
        <div className="flex items-center gap-1">
            {channelList.map((channel) => (
                <button
                    key={channel.id}
                    onClick={() => onChannelChange(channel.id)}
                    className={`channel-btn ${currentChannel === channel.id ? 'active' : ''}`}
                    title={`Switch to ${channel.name}`}
                >
                    {channel.name}
                </button>
            ))}
        </div>
    )
}
