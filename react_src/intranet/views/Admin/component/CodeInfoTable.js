import React, {useState, useReducer, useCallback} from 'react';



const CodeInfoTable = ({props}) => {
  console.log("CodeInfoTable");


  return (
    <ul>
      <li>
        순번, 코드ID, 코드명, 코드레벨, 상위코드ID
      </li>
      {props.map(function(info, index){
        return (<li key={info.id}>
          {index+1}, {info.code_id}, {info.code_name},
           {info.code_level}, {info.upper_code}
        </li>);
      }
      )}
    </ul>
  )
}


export default CodeInfoTable;
