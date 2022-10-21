

const CustomDD = ({CustomToggle, btnText, ddheader,  }) => {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="my-wallet-dd">
                    <span className="fw-normal me-2">{btnText}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark" className="bg-dark p-2" style={{ border: '1px solid #333' }}>
                    <Dropdown.Header>
                        <h3 className="text-white mb-1">{ddheader}</h3>
                        {`${account.slice(0, 5)}....${account.slice(37, 42)}`}
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item className="p-2 fw-normal">
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2 fw-normal" onClick={handleLogout}>Sign Out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}