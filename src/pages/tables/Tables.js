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
                                 columns,
                               }) {

  const [ resultList, setResultList ] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(menuInfo.link);
        if (response.data.code === 200) {
          let data = response.data.data;

          console.log('data:: ', data);
          setResultList(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
            columns={columns}
            options={{
              filterType: "checkbox",
            }}
          />
        </Grid>
        {/*<Grid item xs={12}>*/}
        {/*  <Widget title="Material-UI Table" upperTitle noBodyPadding>*/}
        {/*    <Table data={mock.table} />*/}
        {/*  </Widget>*/}
        {/*</Grid>*/}
      </Grid>
    </>
  );
}
