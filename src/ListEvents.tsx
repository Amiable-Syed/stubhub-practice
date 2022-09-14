import React,{useState,useEffect} from 'react';


type Child ={
    children: any [],
    events:any [],
    id: number,
    name: string
}

const ListEvents=()=> {
  const [data,setData]=useState([]);
  const [filterData,setFilterData] = useState([]);
  const [searchCity, setSearchCity] = React.useState('');
  const [searchPrice, setPriceSearch] = React.useState<number>(-1);
 /**
  * get data from json file
  */
  const getData=()=>{
    fetch('events.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(myJson) {
        let eventsData:any = [];
        const {children} = myJson;
        children.forEach((child:Child)=>{
            const {children} = child;
            children.forEach((eventChild:Child)=>{
                const {events} = eventChild;
                eventsData.push(...events); 
            })
        })
    setData(eventsData);
    setFilterData(eventsData);
    });
  }


  /**
   * call the json file and store it in state
   */
  useEffect(()=>{
    getData()
  },[])

  
  /**
   * Onchange handler for input fields
   * @param e 
   */
  const onChange=(e:any)=>{
    if(e.target.name === 'city'){
        setSearchCity(e.target.value)
    } else{
        if(e.target.value === ""){
            setPriceSearch(-1);
        } else{
            setPriceSearch(+(e.target.value))
        }
    }
  }

  /**
   * get Results when search button is clicked
   * 
   */
  const getSearchResults=()=>{
    if(searchCity.length > 0 || searchPrice > 0){
        let dataFiltered = data.filter((item:any) =>
        item?.city.toLowerCase().includes(searchCity.toLowerCase())
        );

        if(searchPrice !== -1) {
            if(searchCity.length > 0)
                dataFiltered = dataFiltered.filter((item:any) =>item?.price <= +(searchPrice));
            else 
                dataFiltered = data.filter((item:any) =>item?.price <= +(searchPrice));
        }
        setFilterData(dataFiltered);  
    } else{
        setFilterData(data);  
    }
};

  return (
    <>
        <div className='filters'>
            <input name='city' type='text' placeholder='Search by City' onChange={onChange}/>
            <input name='price' type='text' placeholder='Search by Price' onChange={onChange}/>
            <button onClick={getSearchResults}>Search</button>
        </div>
        <table className='table-grid'>
            <thead>
                <tr>
                <th>ID</th>
                <th>City</th>
                <th>Artist</th>
                <th>Price</th>
                </tr>
            </thead>
            <tbody>
            {filterData && filterData.length>0 && filterData.map((event: any,eventIdx:number)=>{
                return <React.Fragment  key={`{${eventIdx}-event}`}>
                    <tr>
                        <td>{event.id}</td>
                        <td>{event.city}</td>
                        <td>{event.name}</td>
                        <td>{event.price}</td>
                    </tr>
                </React.Fragment>
            })}
             </tbody>
        </table>
    </>
  );
}

export default ListEvents;