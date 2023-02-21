import { forwardRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';


const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <button
        className='text-white border-0 '
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


function DropDownComponent({ handleStake, lbl1, pid, tokenId, options }) {
    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                <i className="fa fa-fw" aria-hidden="true" title="Copy to use ellipsis-v"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    options.map((item, i) => (
                        <Dropdown.Item key={i} onClick={(e) => {
                            e.preventDefault()
                            item.handler(item.pid, item.tokenId)
                        }}>{item.label}</Dropdown.Item>
                    ))
                }
                
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default DropDownComponent;