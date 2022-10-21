import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const TooltipIcon = ({ id, tooltipTxt, placement, children }) => {
    
    return (
        <>
            <OverlayTrigger
                key={id}
                placement={placement}
                overlay={
                    <Tooltip id={`tooltip-${id}`}>
                        {tooltipTxt}
                    </Tooltip>
                }
            >
                {children}
            </OverlayTrigger>
        </>
    )
}

export default TooltipIcon