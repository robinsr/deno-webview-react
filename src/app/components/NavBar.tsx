import { Link, React, bulma } from "../../deps.client.ts";

const { Navbar, Button } = bulma;


type NavLinkProps = {
  link: string;
  title: string;
}
const NavLink = ({ link, title}: NavLinkProps) => {
  return (
    <Navbar.Item>
      <Link to={link}>{title}</Link>
    </Navbar.Item>
  )
}

const links = [
  { link: "/", title: "Home" },
  { link: "/getting-started", title: "Getting Started" },
  { link: "/users/lambtron", title: "Dynamic Routes" },
]

export function NavBar() {

  const [ open, toggle ] = React.useState(false);

  const handleClose = (e) => {
    close();
  }

  return (
    <Navbar color={'dark'} active={open}>
      <Navbar.Brand>
        <Navbar.Item>
          <img src="https://docs.deno.com/img/logo.svg" width="100" height="28" alt={'logo'} />
        </Navbar.Item>
        <Navbar.Burger onClick={() => toggle(!open)} />
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          {links.map(lnk => (
            <NavLink {...lnk} />
          ))}
        </Navbar.Container>
        <Navbar.Container align={'end'}>
          <Navbar.Item>
            <Button color={'danger'} size={'small'} onClick={handleClose}>
              Quit (<kbd>⌃</kbd>+<kbd>C</kbd>)
            </Button>
          </Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );
}