import React, { useEffect, useState } from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";

// context
import { useLayoutState } from "../../context/LayoutContext";
import {
  Accessibility as PrivacyIcon,
  AccountTree as CmsMenuIcon,
  BallotOutlined as BoardIcon,
  CategoryOutlined as CategoryIcon,
  CheckBox as TermIcon,
  GridOn as CodeIcon,
  Help as InquiryIcon, LiveHelp as FaqIcon, Notifications as NoticeIcon, NotInterested as DropMemberIcon,
  OpenInBrowser as PopupIcon,
  PersonOutline as MemberIcon,
  SupervisorAccountOutlined as AdminIcon,
  ViewAgenda as FrontMenuIcon,
  VpnKey as AuthIcon,
  Web as BannerIcon,
  WebOutlined as SiteIcon,
} from "@material-ui/icons";
import api from "../../api/api";

function Layout(props) {
  var classes = useStyles();
  const [menuData, setMenuData] = useState([]);

  // global
  var layoutState = useLayoutState();

  const setMenuIcon = (menuCode) => {
    switch (menuCode) {
      case 'ADMIN_MANAGEMENT': return <AdminIcon/>;
      case 'SITE_MANAGEMENT': return <SiteIcon/>;
      case 'MEMBER_MANAGEMENT': return <MemberIcon/>;
      case 'CATEGORY_MANAGEMENT': return <CategoryIcon/>;
      case 'BOARD_MANAGEMENT': return <BoardIcon/>;
      case 'TERM_MANAGEMENT': return <TermIcon/>;
      case 'CODE_MANAGEMENT': return <CodeIcon/>;
      case 'CMS_MENU_MANAGEMENT': return <CmsMenuIcon/>;
      case 'ADMIN_AUTH_MANAGEMENT': return <AuthIcon/>;
      case 'FRONT_MENU_MANAGEMENT': return <FrontMenuIcon/>;
      case 'POPUP_MANAGEMENT': return <PopupIcon/>;
      case 'BANNER_MANAGEMENT': return <BannerIcon/>;
      case 'INQUIRY_MANAGEMENT': return <InquiryIcon/>;
      case 'FAQ_MANAGEMENT': return <FaqIcon/>;
      case 'NOTICE_MANAGEMENT': return <NoticeIcon/>;
      case 'DROP_MEMBER_MANAGEMENT': return <DropMemberIcon/>;
      case 'PRIVACY_MANAGEMENT': return <PrivacyIcon/>;
    }
  }

  useEffect(() => {
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
          }
          setMenuData(menuList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  fetchData();
  }, []);

  const renderRoutes = () => {
    return menuData.map((menu) =>
      menu.children.map((subMenu) => (
        <Route key={subMenu.id} path={subMenu.link} render={
          (props) =>
            <Tables
              title={menu.label}
              menuInfo={subMenu}
              columns={
              [
                'NO',
                '이메일',
                '이름',
                '마지막 로그인일',
                '계정 상태',
                '사용 여부',
                '생성일'
              ]
            }
            />
        }/>
      ))
    )
  };

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar menuList={menuData} />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              {renderRoutes()}
              <Route path="/cms/dashboard" component={Dashboard}/>
              <Redirect from="/" to="/cms/dashboard" />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
