import { forwardRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';


const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <button
        className='text-white '
        style={{background: 'transparent'}}
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </button>
));


function DropDownComponent({ handleStake, lbl1, pid, tokenId }) {
    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                <i className="fa fa-fw" aria-hidden="true" title="Copy to use ellipsis-v"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => {
                    e.preventDefault()
                    handleStake(pid, tokenId)
                }}>{lbl1}</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default DropDownComponent;