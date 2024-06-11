import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List, Typography } from "@material-ui/core";
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  GridOn as CodeIcon,
  CheckBox as TermIcon,
  SupervisorAccountOutlined as AdminIcon,
  WebOutlined as SiteIcon,
  PersonOutline as MemberIcon,
  CategoryOutlined as CategoryIcon,
  BallotOutlined as BoardIcon,
  ArrowBack as ArrowBackIcon,
  ViewAgenda as CmsMenuIcon,
  ViewAgenda as FrontMenuIcon,
  VpnKey as AuthIcon,
  OpenInBrowser as PopupIcon,
  Web as BannerIcon,
  Help as InquiryIcon,
  LiveHelp as FaqIcon,
  Notifications as NoticeIcon,
  NotInterested as DropMemberIcon,
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import api from "../../api/api";

  // { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  // {
  //   id: 1,
  //   label: "Typography",
  //   link: "/app/typography",
  //   icon: <TypographyIcon />,
  // },
  // { id: 2, label: "Tables", link: "/app/tables", icon: <TableIcon /> },
  // {
  //   id: 3,
  //   label: "Notifications",
  //   link: "/app/notifications",
  //   icon: <NotificationsIcon />,
  // },
  // {
  //   id: 4,
  //   label: "UI Elements",
  //   link: "/app/ui",
  //   icon: <UIElementsIcon />,
  //   children: [
  //     { label: "Icons", link: "/app/ui/icons" },
  //     { label: "Charts", link: "/app/ui/charts" },
  //     { label: "Maps", link: "/app/ui/maps" },
  //   ],
  // },
  // { id: 5, type: "divider" },
  // { id: 6, type: "title", label: "HELP" },
  // { id: 7, label: "Library", link: "", icon: <LibraryIcon /> },
  // { id: 8, label: "Support", link: "", icon: <SupportIcon /> },
  // { id: 9, label: "FAQ", link: "", icon: <FAQIcon /> },

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var [structure, setStructure] = useState([]);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [errorMessage, setErrorMessage] = useState("");

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();

    const setMenuIcon = (menuCode) => {
      let icon;
      switch (menuCode) {
        case 'ADMIN_MANAGEMENT': icon = <AdminIcon/>;
          break;
        case 'SITE_MANAGEMENT': icon = <SiteIcon/>;
          break;
        case 'MEMBER_MANAGEMENT': icon = <MemberIcon/>;
          break;
        case 'CATEGORY_MANAGEMENT': icon = <CategoryIcon/>;
          break;
        case 'BOARD_MANAGEMENT': icon = <BoardIcon/>;
          break;
        case 'TERM_MANAGEMENT': icon = <TermIcon/>;
          break;
        case 'CODE_MANAGEMENT': icon = <CodeIcon/>;
          break;
        case 'CMS_MENU_MANAGEMENT': icon = <CmsMenuIcon/>;
          break;
        case 'ADMIN_AUTH_MANAGEMENT': icon = <AuthIcon/>;
          break;
        case 'FRONT_MENU_MANAGEMENT': icon = <FrontMenuIcon/>;
          break;
        case 'POPUP_MANAGEMENT': icon = <PopupIcon/>;
          break;
        case 'BANNER_MANAGEMENT': icon = <BannerIcon/>;
          break;
        case 'INQUIRY_MANAGEMENT': icon = <InquiryIcon/>;
          break;
        case 'FAQ_MANAGEMENT': icon = <FaqIcon/>;
          break;
        case 'NOTICE_MANAGEMENT': icon = <NoticeIcon/>;
          break;
        case 'DROP_MEMBER_MANAGEMENT': icon = <DropMemberIcon/>;
          break;
      }
      return icon;
    }

    const fetchData = async () => {
      try {
        const response = await api.get("/cms/menu/list");
        if (response.data.code === 200) {
          let data = response.data.data;
          let menuList = [];
          for (let i = 0; i < data.length; i++) {
            let cmsMenu = {};
            if (data[i].menuLevel === 1) {
              cmsMenu = {
                key: data[i].cmsMenuSeq,
                id: data[i].cmsMenuSeq,
                label: data[i].menuNm,
                link: data[i].filePath,
                icon: setMenuIcon(data[i].menuCode),
                children: []
              };
              for (let j = 0; j < data.length; j++) {
                if (data[j].authDir === data[i].authDir && data[j].menuLevel === 2) {
                  cmsMenu.children.push({
                    key: data[j].cmsMenuSeq,
                    id: data[j].cmsMenuSeq,
                    label: data[j].menuNm,
                    link: data[j].filePath,
                    icon: setMenuIcon(data[j].menuCode)
                  });
                }
              }
              menuList.push(cmsMenu);
            }
            console.log('cmsMenu:: ', cmsMenu);
          }
          setStructure(menuList);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();

    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  }, []);

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">An error occurred while fetching data.</Typography>;
  }

}

export default withRouter(Sidebar);
