import { useEffect, useState } from 'react';

type DBPurchase = {
	id  : number,
	desc: string,
	cost: number,
	prepay?: number,
	client?: number,
};

function Todo() {
	const [purchase, setpurhases] = useState<DBPurchase[]>([]);

	let update_table = async () => {
		try{
			const response = await fetch('/api/v1/purchase/list', {method:'GET'});
				if(!response.ok)
					setpurhases([]);
				else
					setpurhases(await response.json() || []) ;
		}
		catch(error){
			console.log(error)
		}
	};

	const PurchaseTable = ( {purchases} : {purchases: DBPurchase[]}) => {
		let ps = purchases.map(p  => {
			return <tr key={p.id}>
				<td className="m-1 p-1"> {p.id} </td>
				<td className="m-1 p-1"> {p.desc} </td>
				<td className="m-1 p-1"> {p.cost / 100.} </td>
				<td > <button onClick={ _ => 
					fetch(`/api/v1/purchase/delete/${p.id}`, { method:'DELETE' }).then( _ => update_table())
				}> terminado </button> </td>
			</tr>;
		});
		return <table className='Purchase w-full'>
			<tr className="bg-blue-300">
				<th> ID </th>
				<th className="w-96"> Desc </th>
				<th> Precio </th>
				<th>terminado</th>
			</tr>
			{ps}
		</table>;
	}

	useEffect(() => { update_table() }, []);


	return (
		<div className="App m-auto w-8/12">
			<PurchaseTable purchases={purchase}/>
			<form onSubmit={e => {
				e.preventDefault();
				const target = e.target as typeof e.target & {
					desc: {value: string},
					cost: {value: string},
				};
				const cost = Number.parseFloat(target.cost.value);

				let bd = JSON.stringify({ cost: cost * 100, desc: target.desc.value});
				fetch('/api/v1/purchase/add', {
					method: 'POST',
			    headers: { 'Content-Type': 'application/json' },
					body: bd,
				}).then(_ => update_table());

				e.currentTarget.reset();
			}} className="flex bg-sky-100 w-full">
				<div className="m-auto ml-1"> descripcion: </div>
				<input id="desc" type="text" defaultValue={""} className="m-1 w-full align-middle"/>
				<div className="m-auto">precio: </div><input id="cost" type="number" defaultValue={0} className="m-1 max-w-fit"/>
				<button type='submit' className="p-1 mr-1 mb-1 mt-1"> submit </button>
			</form>
		</div>
	);
}

export default Todo;
