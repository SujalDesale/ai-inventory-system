export default function Settings() {
  return (
    <div className="grid gap-6">
      <section className="card">
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Starter template — customize this page.</p>

<form className="grid gap-3 max-w-2xl" onSubmit={(e)=>e.preventDefault()}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div><label className="label">Name</label><input className="input" /></div>
    <div><label className="label">GST (%)</label><input type="number" className="input" /></div>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <div><label className="label">Default Threshold</label><input type="number" className="input" /></div>
    <div><label className="label">Notifications</label><select className="input"><option>Web Push</option><option>SMS</option><option>Email</option></select></div>
    <div><label className="label">Invoice Prefix</label><input className="input" value="INV-" readOnly /></div>
  </div>
  <button className="btn btn-primary">Save</button>
</form>

      </section>
    </div>
  )
}
