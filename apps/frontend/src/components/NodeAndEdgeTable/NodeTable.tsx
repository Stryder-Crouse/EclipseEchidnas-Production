import "../../css/file-table.css";

function NodeTable() {
  return (
    <div className={"table-container"}>
      <span className={"caption-container"}>
        <span className={"table-title"}>Current Node .CSV File</span>
      </span>
      <div className={"table-wrapper"}>
        <table>
          <thead>
            <tr>
              <th>nodeID</th>
              <th>xcoord</th>
              <th>ycoord</th>
              <th>floor</th>
              <th>building</th>
              <th>nodeType</th>
              <th>longName</th>
              <th>shortName</th>
            </tr>
          </thead>
          <tbody id={"table-rows"}>
            <tr>
              <td className={"node-id"}>CCONF001L1</td>
              <td>2255</td>
              <td>849</td>
              <td>L1</td>
              <td>45 Francis</td>
              <td>CONF</td>
              <td>Anesthesia Conf Floor L1</td>
              <td>Conf C001L1</td>
            </tr>
            <tr>
              <td className={"node-id"}>CCONF002L1</td>
              <td>2665</td>
              <td>1043</td>
              <td>L1</td>
              <td>45 Francis</td>
              <td>CONF</td>
              <td>Medical Records Conference Room Floor L1</td>
              <td>Conf C002L1</td>
            </tr>
            <tr>
              <td className={"node-id"}>CCONF003L1</td>
              <td>2445</td>
              <td>1245</td>
              <td>L1</td>
              <td>45 Francis</td>
              <td>CONF</td>
              <td>Abrams Conference Room</td>
              <td>Conf C003L1</td>
            </tr>
            <tr>
              <td className={"node-id"}>CDEPT002L1</td>
              <td>1980</td>
              <td>844</td>
              <td>L1</td>
              <td>Tower</td>
              <td>DEPT</td>
              <td>Day Surgery Family Waiting Floor L1</td>
              <td>Department C002L1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NodeTable;
