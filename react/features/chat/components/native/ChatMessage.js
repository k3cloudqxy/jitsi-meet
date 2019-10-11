// @flow

import React from 'react';
import { Text, View } from 'react-native';

import { Avatar } from '../../../base/avatar';
import { translate } from '../../../base/i18n';
import { Linkify } from '../../../base/react';

import { replaceNonUnicodeEmojis } from '../../functions';

import AbstractChatMessage, { type Props } from '../AbstractChatMessage';
import PrivateMessageButton from '../PrivateMessageButton';

import styles from './styles';

/**
 * Renders a single chat message.
 */
class ChatMessage extends AbstractChatMessage<Props> {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { message } = this.props;
        const localMessage = message.messageType === 'local';

        // Style arrays that need to be updated in various scenarios, such as
        // error messages or others.
        const detailsWrapperStyle = [
            styles.detailsWrapper
        ];
        const textWrapperStyle = [
            styles.textWrapper
        ];

        if (localMessage) {
            // The wrapper needs to be aligned to the right.
            detailsWrapperStyle.push(styles.ownMessageDetailsWrapper);

            // The bubble needs to be differently styled.
            textWrapperStyle.push(styles.ownTextWrapper);
        } else if (message.messageType === 'error') {
            // The bubble needs to be differently styled.
            textWrapperStyle.push(styles.systemTextWrapper);
        }

        return (
            <View style = { styles.messageWrapper } >
                { this._renderAvatar() }
                <View style = { detailsWrapperStyle }>
                    <View style = { styles.replyWrapper }>
                        <View style = { textWrapperStyle } >
                            {
                                this.props.showDisplayName
                                    && this._renderDisplayName()
                            }
                            <Linkify linkStyle = { styles.chatLink }>
                                { replaceNonUnicodeEmojis(this._getMessageText()) }
                            </Linkify>
                            {
                                message.privateMessage
                                    && this._renderPrivateNotice()
                            }
                        </View>
                        { message.privateMessage && !localMessage
                            && <PrivateMessageButton
                                participantID = { message.id }
                                reply = { true }
                                showLabel = { false }
                                toggledStyles = { styles.replyStyles } /> }
                    </View>
                    { this.props.showTimestamp && this._renderTimestamp() }
                </View>
            </View>
        );
    }

    _getFormattedTimestamp: () => string;

    _getMessageText: () => string;

    _getPrivateNoticeMessage: () => string;

    /**
     * Renders the avatar of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderAvatar() {
        const { message } = this.props;

        return (
            <View style = { styles.avatarWrapper }>
                { this.props.showAvatar && <Avatar
                    displayName = { message.displayName }
                    participantId = { message.id }
                    size = { styles.avatarWrapper.width } />
                }
            </View>
        );
    }

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderDisplayName() {
        return (
            <Text style = { styles.displayName }>
                { this.props.message.displayName }
            </Text>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    _renderPrivateNotice() {
        return (
            <Text style = { styles.privateNotice }>
                { this._getPrivateNoticeMessage() }
            </Text>
        );
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    _renderTimestamp() {
        return (
            <Text style = { styles.timeText }>
                { this._getFormattedTimestamp() }
            </Text>
        );
    }
}

export default translate(ChatMessage);
