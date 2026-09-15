<?php
session_start(); header('Content-Type: application/json');
$action=$_GET['action']??''; $entity=$_GET['entity']??'';
$allowed=['Project','Service','Inquiry','ModelAsset'];
$dataDir=__DIR__.'/data'; $uploadDir=dirname(__DIR__).'/uploads';
if(!is_dir($dataDir)) mkdir($dataDir,0755,true); if(!is_dir($uploadDir)) mkdir($uploadDir,0755,true);
function body(){ return json_decode(file_get_contents('php://input'),true)?:[]; }
function fileFor($e){ global $dataDir; return $dataDir.'/'.strtolower($e).'.json'; }
function loadE($e){$f=fileFor($e); return file_exists($f)?(json_decode(file_get_contents($f),true)?:[]):[];}
function saveE($e,$v){file_put_contents(fileFor($e),json_encode($v,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES),LOCK_EX);}
function admin(){if(empty($_SESSION['user'])){http_response_code(401);echo json_encode(['error'=>'Authentication required']);exit;}}
if($action==='login'){ $b=body(); $cfg=require __DIR__.'/settings.php'; if(strtolower($b['email']??'')===strtolower($cfg['admin_email']) && password_verify($b['password']??'',$cfg['admin_password_hash'])){$_SESSION['user']=['email'=>$cfg['admin_email'],'role'=>'admin']; echo json_encode($_SESSION['user']);}else{http_response_code(401);echo json_encode(['error'=>'Invalid email or password']);} exit; }
if($action==='logout'){session_destroy();echo json_encode(['ok'=>true]);exit;}
if($action==='me'){if(empty($_SESSION['user'])){http_response_code(401);echo json_encode(['error'=>'Not signed in']);}else echo json_encode($_SESSION['user']);exit;}
if(!in_array($entity,$allowed) && !in_array($action,['upload'])){http_response_code(400);echo json_encode(['error'=>'Invalid entity']);exit;}
if($action==='list'){ $rows=loadE($entity); $sort=$_GET['sort']??''; $key=ltrim($sort,'-'); if($key){usort($rows,function($a,$b)use($key,$sort){$c=($a[$key]??'')<=>($b[$key]??'');return str_starts_with($sort,'-')?-$c:$c;});} echo json_encode(array_slice($rows,0,(int)($_GET['limit']??50))); exit; }
if($action==='create'){ if($entity!=='Inquiry') admin(); $rows=loadE($entity);$r=body();$r['id']=$r['id']??bin2hex(random_bytes(8));$r['created_date']=date('c');$rows[]=$r;saveE($entity,$rows);echo json_encode($r);exit; }
if($action==='update'){admin();$rows=loadE($entity);$b=body();$id=$_GET['id']??'';foreach($rows as &$r)if(($r['id']??'')===$id)$r=array_merge($r,$b);saveE($entity,$rows);echo json_encode(['ok'=>true]);exit;}
if($action==='delete'){admin();$id=$_GET['id']??'';$rows=array_values(array_filter(loadE($entity),fn($r)=>($r['id']??'')!==$id));saveE($entity,$rows);echo json_encode(['ok'=>true]);exit;}
if($action==='upload'){admin();if(empty($_FILES['file'])){http_response_code(400);echo json_encode(['error'=>'No file']);exit;}$n=preg_replace('/[^A-Za-z0-9._-]/','_',basename($_FILES['file']['name']));$n=time().'_'.$n;move_uploaded_file($_FILES['file']['tmp_name'],$uploadDir.'/'.$n);echo json_encode(['file_url'=>'/uploads/'.$n]);exit;}
http_response_code(404); echo json_encode(['error'=>'Unknown action']);
