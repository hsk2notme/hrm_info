"use client";
import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';

function loadPickerScript(callback) {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.onload = callback;
  document.body.appendChild(script);
}

export default function Home() {
  const [form, setForm] = React.useState({
    fullName: '',
    gender: '',
    dob: '',
    phone: '',
    permanentAddress: '',
    currentAddress: '',
    unitName: '',
    email: '',
    facebook: '',
    citizenId: '',
    citizenFront: null,
    citizenBack: null,
    staffPhoto: null,
    position: '',
    workType: '',
    startDate: '',
    role: '',
    department: '',
    memberOf: '',
    workPlace: '',
    vehiclePlate: '',
    joinInternalGroup: '',
    vpBankAccount: '',
    vpBankOwner: '',
    vpBankBranch: '',
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.confirm) {
    alert('Bạn phải xác nhận cam đoan thông tin!');
    return;
  }
  await fetch('http://localhost:5000/hrminfo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  alert('Đã gửi thông tin!');
};

  useEffect(() => {
    loadPickerScript(() => {
      window.gapi.load('auth', { callback: () => {} });
      window.gapi.load('picker', { callback: () => {} });
    });
  }, []);

const handleGoogleDriveUpload = (field) => {
  const clientId = '850546860539-dafjeeu61vc3c2orbarbkvoug8s1vt3p.apps.googleusercontent.com';
  const scope = ['https://www.googleapis.com/auth/drive.file'];
  window.gapi.auth.authorize(
    {
      client_id: clientId,
      scope: scope.join(' '),
      immediate: false,
    },
    function (authResult) {
      if (authResult && !authResult.error) {
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS)
          .addView(window.google.picker.ViewId.UPLOAD)
          .setOAuthToken(authResult.access_token)
          .setDeveloperKey('YOUR_DEVELOPER_KEY')
          .setCallback(function (data) {
            if (data.action === window.google.picker.Action.PICK) {
              const file = data.docs[0];
              setForm((prev) => ({
                ...prev,
                [field + 'DriveId']: file.id,
                [field + 'DriveName']: file.name,
              }));
            }
          })
          .build();
        picker.setVisible(true);
      }
    }
  );
};

  return (
    <Container maxWidth="md" sx={{ bgcolor: '#f3e8ff', minHeight: '100vh', py: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: '#fff', p: 3, borderRadius: 3, boxShadow: 2 }}>
        {/* Thông tin cá nhân */}
        <Box mb={3} p={2} sx={{border:'1px solid #a78bfa', borderRadius:2, background:'#f8f5ff'}}>
          <Typography variant="h6" color="primary" fontWeight={700} mb={2}>Thông tin cá nhân</Typography>
          <Box mb={2}><input name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="dob" type="text" placeholder="Ngày sinh (d/m/yyyy)" value={form.dob} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}>
            <select name="gender" value={form.gender} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </Box>
          <Box mb={2}><input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="permanentAddress" placeholder="Địa chỉ thường trú" value={form.permanentAddress} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="currentAddress" placeholder="Địa chỉ hiện tại" value={form.currentAddress} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="unitName" placeholder="Đơn vị (Tên Đại học đang theo học)" value={form.unitName} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="facebook" placeholder="Link Facebook" value={form.facebook} onChange={handleChange} style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}><input name="citizenId" placeholder="Số Căn cước công dân" value={form.citizenId} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}>
            <label style={{display:'block', fontWeight:500, marginBottom:4}}>Ảnh CCCD mặt trước</label>
            <button type="button" onClick={() => handleGoogleDriveUpload('citizenFront')} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #a78bfa', background:'#f8f5ff', color:'#6d28d9', fontWeight:600}}>
              {form.citizenFrontDriveName ? 'Đã chọn: ' + form.citizenFrontDriveName : 'Thêm tệp từ Google Drive'}
            </button>
          </Box>
          <Box mb={2}>
            <label style={{display:'block', fontWeight:500, marginBottom:4}}>Ảnh CCCD mặt sau</label>
            <button type="button" onClick={() => handleGoogleDriveUpload('citizenFront')} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #a78bfa', background:'#f8f5ff', color:'#6d28d9', fontWeight:600}}>
              {form.citizenFrontDriveName ? 'Đã chọn: ' + form.citizenFrontDriveName : 'Thêm tệp từ Google Drive'}
            </button>
          </Box>
        </Box>
        {/* Thông tin công việc */}
        <Box mb={3} p={2} sx={{border:'1px solid #a78bfa', borderRadius:2, background:'#f8f5ff'}}>
          <Typography variant="h6" color="primary" fontWeight={700} mb={2}>Thông tin công việc</Typography>
          <Box mb={2}>
            <select name="position" value={form.position} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Chức danh</option>
              <option>Part-time thử việc</option>
              <option>Part-time chính thức</option>
              <option>Full-time thử việc</option>
              <option>Full-time chính thức</option>
              <option>Giảng viên/trợ giảng thử việc</option>
              <option>Giảng viên/trợ giảng chính thức</option>
            </select>
          </Box>
          <Box mb={2}><input name="startDate" type="text" placeholder="Ngày bắt đầu làm việc (d/m/yyyy)" value={form.startDate} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}>
            <select name="workType" value={form.workType} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Hình thức làm việc</option>
              <option>Part time offline</option>
              <option>Part time online</option>
              <option>Full time</option>
            </select>
          </Box>
          <Box mb={2}>
            <select name="role" value={form.role} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Chức vụ</option>
              <option>Academic Director</option>
              <option>Trainer</option>
              <option>Teaching Assistant</option>
              <option>Operations Director</option>
              <option>Manager</option>
              <option>Deputy Manager</option>
              <option>Leader</option>
              <option>Sub leader</option>
              <option>Staff</option>
              <option>Intern</option>
              <option>Branch Director</option>
              <option>Internal Accountant</option>
              <option>Tax Accountant</option>
              <option>Developer</option>
            </select>
          </Box>
          <Box mb={2}>
            <select name="department" value={form.department} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Phòng/Ban</option>
              <option>HR & Administrator Manager</option>
              <option>IELTS Academic</option>
              <option>TOEIC Academic</option>
              <option>Computer Science Academic</option>
              <option>Chinese Academic</option>
              <option>APTIS Academic</option>
              <option>Marketing Sales</option>
              <option>Branding Marketing</option>
              <option>Customer Service</option>
              <option>Soc Son Town Branch (team Chị Nguyễn Khánh Linh)</option>
              <option>Business Center (team Chị Phạm Thị Thu Phương)</option>
              <option>HCM City Branch</option>
              <option>SAT Academic</option>
              <option>VSTEP Academic</option>
              <option>GOUNI Academic</option>
            </select>
          </Box>
          <Box mb={2}>
            <select name="memberOf" value={form.memberOf} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Thành viên trực thuộc</option>
              <option>10 Education - Tin học</option>
              <option>10 Education - IELTS</option>
              <option>10 Education - SAT</option>
              <option>10 Education - Slide</option>
              <option>The TOEIC Lab</option>
              <option>Tiếng Trung 86 HSK</option>
              <option>VSTEP PLUS</option>
              <option>APTIS One</option>
              <option>AI Pencil</option>
              <option>GOUNI</option>
            </select>
          </Box>
          <Box mb={2}>
            <select name="workPlace" value={form.workPlace} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Nơi làm việc</option>
              <option>Sóc Sơn - Hà Nội</option>
              <option>158-160 Nhật Tảo - TP.HCM</option>
              <option>295 Thanh Nhàn - Hà Nội</option>
              <option>197 Trần Phú, Hà Đông - Hà Nội</option>
            </select>
          </Box>
          <Box mb={2}><input name="vehiclePlate" placeholder="Biển số xe (chỉ cho nhân sự 295 Thanh Nhàn)" value={form.vehiclePlate} onChange={handleChange} style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}} /></Box>
          <Box mb={2}>
            <select name="joinInternalGroup" value={form.joinInternalGroup} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Tham gia nhóm Bản tin Nội bộ 10 Group và follow Instagram 10nhohon3?</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Box>
          <Box mb={2}>
            <label style={{display:'block', fontWeight:500, marginBottom:4}}>Ảnh thẻ nhân viên</label>
            <button type="button" onClick={() => handleGoogleDriveUpload('citizenFront')} style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #a78bfa', background:'#f8f5ff', color:'#6d28d9', fontWeight:600}}>
              {form.citizenFrontDriveName ? 'Đã chọn: ' + form.citizenFrontDriveName : 'Thêm tệp từ Google Drive'}
            </button>
          </Box>
        </Box>
        {/* Thông tin tài khoản ngân hàng */}
        <Box mb={3} p={2} sx={{border:'1px solid #a78bfa', borderRadius:2, background:'#f8f5ff'}}>
          <Typography variant="h6" color="primary" fontWeight={700} mb={2}>Thông tin tài khoản ngân hàng</Typography>
          <Box mb={2}>
            <select name="vpBankAccount" value={form.vpBankAccount} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Số tài khoản VPBank</option>
              <option>Chưa có tài khoản VP Bank</option>
              <option>Đã có những muốn mở mới</option>
              <option>Mục khác</option>
            </select>
          </Box>
          <Box mb={2}>
            <select name="vpBankOwner" value={form.vpBankOwner} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Chủ tài khoản VPBank</option>
              <option>Chưa có tài khoản VP Bank</option>
              <option>Đã có nhưng muốn mở mới</option>
              <option>Mục khác</option>
            </select>
          </Box>
          <Box mb={2}>
            <select name="vpBankBranch" value={form.vpBankBranch} onChange={handleChange} required style={{width:'100%', padding:8, borderRadius:8, border:'1px solid #ccc'}}>
              <option value="">Chi nhánh VPBank đã mở tài khoản</option>
              <option>Chưa có tài khoản VP Bank</option>
              <option>Đã có nhưng muốn mở mới</option>
              <option>Mục khác</option>
            </select>
          </Box>
        </Box>
        {/* Cam đoan */}
        <Box mb={2} display="flex" alignItems="center">
          <input type="checkbox" name="confirm" checked={form.confirm} onChange={handleChange} required style={{marginRight:8}} />
          <Typography variant="body1" color="textPrimary">Tôi cam đoan các thông tin khai trên là đúng sự thật và sẽ chịu trách nhiệm trước pháp luật nếu có hành vi làm giả giấy tờ/khai thông tin không đúng sự thật.</Typography>
        </Box>
        <Box textAlign="center" mt={3}>
          <button type="submit" style={{background:'#a78bfa', color:'#fff', padding:'12px 32px', border:'none', borderRadius:8, fontWeight:700, fontSize:18, cursor:'pointer'}}>Gửi thông tin</button>
        </Box>
      </Box>
    </Container>
  );
}
