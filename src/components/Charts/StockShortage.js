import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import {useDispatch, useSelector} from "react-redux"
import { getItems } from "../redux-actions/items";






const Example =()=>{
const[itemdata,setItemData] = useState([])
const[toggle,setToggle] = useState(false)
const[reducedItem,setReducedItem] = useState([])
const dispatch = useDispatch()
 
  const data = useSelector((state)=>{
    return state.item.products
  })

  useEffect(()=>{
    setItemData(data)
    dispatch(getItems())
    setToggle(!toggle)
  },[])


useMemo(()=>{
  setTimeout(()=>{
    const reducedData = itemdata.reduce((pv,cv)=>{
      if(cv.stock <= cv.minTracking){
        const obj = {name:cv.name,value:cv.stock }
        pv.push(obj)
        return pv
      }
      return pv
  
    },[])
    setReducedItem(reducedData)
  },100)
},[toggle])




console.log(itemdata,'in graph')

  return (
    <PieChart width={350} height={370}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={reducedItem}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        label
      />
      <Tooltip />
    </PieChart>
  );
}

export default Example