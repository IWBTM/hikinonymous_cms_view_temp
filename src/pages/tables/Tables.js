import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "../dashboard/components/Table/Table";

// data
import mock from "../dashboard/mock";
import api from "../../api/api";

export default function Tables({
                                 tableData,
                                 title,
                                 menuInfo,
                               }) {

  const { resultList, setResultList } = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(menuInfo.filePath);
        if (response.data.code === 200) {
          let data = response.data.data;
          // cms menu에 메뉴별로 어떤 컬럼을 관리자 테이블에 보여줄지에 대한 공통 코드와 추가 컬럼 필요.
          setResultList([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

  }, []);

  return (
    <>
      <PageTitle title={`${title} > ${menuInfo.label}`} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={menuInfo.label}
            data={resultList}
            columns={["Name", "Company", "City", "State"]}
            options={{
              filterType: "checkbox",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Widget title="Material-UI Table" upperTitle noBodyPadding>
            <Table data={mock.table} />
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
