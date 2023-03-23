import {
  Box,
  Burger,
  Center,
  Container,
  createStyles,
  Group,
  Header,
  Paper,
  Text,
  Tooltip,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IconEye } from '@tabler/icons-react';
import { useCallback } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { ThemeSwitch } from './ThemeSwitch';

const HEADER_HEIGHT = 56;

const useStyles = createStyles(theme => ({
  header: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    borderBottom: 'none',
    position: 'relative',
    zIndex: 1,
    marginBottom: theme.spacing.md,
  },

  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  title: {
    color: theme.white,
    textDecoration: 'none',
  },

  icon: {
    verticalAlign: 'top',
    paddingRight: '2px',
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.5),
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
      color: theme.colors.gray[7],

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      },
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colors[theme.primaryColor][9],
      color: theme.white,

      [theme.fn.smallerThan('sm')]: {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },

  linkDisabled: {
    cursor: 'not-allowed',
  },

  tooltip: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}));

export function Page(): JSX.Element {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const [burgerOpened, toggleBurgerOpened] = useToggle();
  const location = useLocation();

  const algorithm = useStore(state => state.algorithm);

  const closeBurger = useCallback(() => toggleBurgerOpened(false), []);

  const links = [
    <Link
      key="home"
      to={`/${location.search}`}
      className={cx(classes.link, { [classes.linkActive]: location.pathname === '/' })}
      onClick={closeBurger}
    >
      Home
    </Link>,
  ];

  if (algorithm !== null) {
    links.push(
      <Link
        key="visualizer"
        to={`/visualizer${location.search}`}
        className={cx(classes.link, { [classes.linkActive]: location.pathname === '/visualizer' })}
        onClick={closeBurger}
      >
        Visualizer
      </Link>,
    );
  } else {
    links.push(
      <Tooltip key="visualizer" label="Load an algorithm first" className={classes.tooltip}>
        <a className={cx(classes.link, classes.linkDisabled)}>Visualizer</a>
      </Tooltip>,
    );
  }

  return (
    <>
      <Header height={HEADER_HEIGHT} className={classes.header}>
        <Container className={classes.container}>
          <span>
            <Link to={`/${location.search}`} className={classes.title} onClick={closeBurger}>
              <Text size="xl" weight={700}>
                <IconEye size={28} className={classes.icon} />
                IMC Prosperity Visualizer
              </Text>
            </Link>
          </span>

          <Group spacing={5} className={classes.links}>
            {links}
          </Group>

          <Burger
            opened={burgerOpened}
            onClick={() => toggleBurgerOpened()}
            color={theme.white}
            className={classes.burger}
            size="sm"
          />

          <Transition transition="pop-top-right" mounted={burgerOpened} duration={200}>
            {styles => (
              <Paper className={classes.dropdown} withBorder={true} style={styles}>
                {links}
              </Paper>
            )}
          </Transition>
        </Container>
      </Header>

      <Outlet />

      <Box m="md">
        <Center>
          <ThemeSwitch />
        </Center>
      </Box>
    </>
  );
}
