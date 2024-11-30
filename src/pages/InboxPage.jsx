import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import "./InboxPage.css"

const InboxPage = () => {
    return (
        <div className="page-container box-gap">
            <div className="box">
                <div className="box-content">
                <div>
                    <div className="admin-inbox">Admin Inbox</div>
                    <div className="sub-title">See and manage incoming requests</div>
                </div>
                <ToggleButtonGroup
                    type="radio"
                    name="options"
                    defaultValue={1}
                    className="toggle-button-group"
                >
                    <ToggleButton id="tbg-radio-1" value={1}>
                        images
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={2}>
                        events
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-3" value={3}>
                        volunteers
                    </ToggleButton>
                </ToggleButtonGroup>

                </div>
            </div>
        </div>
    );
}
export default InboxPage