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
  AccountTree as CmsMenuIcon,
  ViewAgenda as FrontMenuIcon,
  VpnKey as AuthIcon,
  OpenInBrowser as PopupIcon,
  Web as BannerIcon,
  Help as InquiryIcon,
  LiveHelp as FaqIcon,
  Notifications as NoticeIcon,
  NotInterested as DropMemberIcon,
  Accessibility as PrivacyIcon,
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

function Sidebar({ location, menuList }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();

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
        {menuList.map(link => (
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

}

export default withRouter(Sidebar);
