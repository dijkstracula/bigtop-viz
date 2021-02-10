import * as React from 'react';

interface Props {
    msg: string
}

export const MessageBar = (props: Props) => {
    //TODO: This could really be made nicer.
    return (
        <div className="messageBox">
            <fieldset>
                <legend>Messages</legend>
                {props.msg}
            </fieldset>
        </div>
    )
}