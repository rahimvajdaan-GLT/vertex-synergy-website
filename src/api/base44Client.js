// Hostinger-native compatibility client. No Base44 SDK is used.
const API = '/api/index.php';
const req = async (action, options = {}) => {
  const res = await fetch(`${API}?action=${action}`, { credentials: 'include', ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
};
const entity = (name) => ({
  list: (sort='', limit=50) => req('list&entity='+encodeURIComponent(name)+'&sort='+encodeURIComponent(sort)+'&limit='+limit),
  create: (data) => req('create&entity='+encodeURIComponent(name), {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}),
  update: (id,data) => req('update&entity='+encodeURIComponent(name)+'&id='+encodeURIComponent(id), {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}),
  delete: (id) => req('delete&entity='+encodeURIComponent(name)+'&id='+encodeURIComponent(id), {method:'POST'})
});
export const base44 = {
  entities: { Project: entity('Project'), Service: entity('Service'), Inquiry: entity('Inquiry'), ModelAsset: entity('ModelAsset') },
  integrations: { Core: { UploadFile: async ({file}) => { const fd=new FormData(); fd.append('file',file); return req('upload',{method:'POST',body:fd}); } } },
  auth: {
    me: () => req('me'),
    loginViaEmailPassword: (email,password) => req('login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}),
    logout: async () => { try{await req('logout',{method:'POST'});}finally{window.location.href='/';} },
    redirectToLogin: () => { window.location.href='/login'; },
    loginWithProvider: () => { throw new Error('Google login is not enabled on the Hostinger version.'); }
  }
};
