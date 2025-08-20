"use client";
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import AnimatedDropdown from './AnimatedDropdown';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const CustomDateInput = ({ value, onChange, name, placeholder, required }) => {
    const handleInputChange = (e) => {
        let rawValue = e.target.value.replace(/[^\d]/g, '').slice(0, 8);
        let formattedValue = rawValue;

        if (rawValue.length > 4) {
            formattedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2, 4)}/${rawValue.slice(4)}`;
        } else if (rawValue.length > 2) {
            formattedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`;
        }

        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: formattedValue,
                },
            });
        }
    };

    return (
        <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={required}
        />
    );
};

const FileUploadBox = ({ name, label, helpText, previewUrl, onRemove, onChange }) => (
    <Box
        sx={{
            border: '3px solid',
            borderImage: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 50%, #c4b5fd 100%) 1',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #f8f5ff 80%, #ede9fe 100%)',
            p: { xs: 2, md: 3 },
            boxShadow: '0 8px 40px rgba(124,58,237,0.13)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            transition: 'box-shadow 0.2s',
            '&:hover': {
                boxShadow: '0 16px 64px rgba(124,58,237,0.22)'
            }
        }}
    >
        <label
            htmlFor={name}
            style={{
                fontWeight: 600,
                fontSize: 17,
                color: '#7c3aed',
                letterSpacing: '0.03em',
                fontFamily: 'Roboto, Arial, Helvetica, sans-serif'
            }}
        >
            {label}
        </label>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
            }}
        >
            <label
                htmlFor={name}
                style={{
                    cursor: 'pointer',
                    background: '#ede9fe',
                    border: '1.5px dashed #a78bfa',
                    borderRadius: 10,
                    padding: '8px 16px',
                    fontWeight: 600,
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: 16
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 22,
                        transform: 'translateY(-3.5px)'
                    }}
                >
                    📷
                </Box>
                Chọn ảnh
            </label>
            <input
                id={name}
                name={name}
                type="file"
                accept="image/*"
                onClick={e => { e.target.value = null; }}
                onChange={onChange}
                required
                style={{ display: 'none' }}
            />
            {previewUrl && (
                <Box sx={{ position: 'relative', display: 'inline-block', mt: 1 }}>
                    <img
                        src={previewUrl}
                        alt={`Preview ${name}`}
                        style={{
                            maxWidth: '140px',
                            borderRadius: 10,
                            border: '1.5px solid #a78bfa'
                        }}
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#fff',
                            border: '1px solid #a78bfa',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 18,
                            color: '#7c3aed',
                            boxShadow: '0 2px 8px rgba(124,58,237,0.10)'
                        }}
                    >
                        ✕
                    </button>
                </Box>
            )}
        </Box>
        <Typography
            variant="caption"
            color="textSecondary"
            sx={{ textAlign: 'center' }}
        >
            {helpText}
        </Typography>
    </Box>
);

export default function Home() {
    const [preview, setPreview] = React.useState({
        citizenFront: null,
        citizenBack: null,
        staffPhoto: null,
    });
    const [form, setForm] = React.useState({
        fullName: '', gender: '', dob: '', phone: '',
        permanentAddress: '', currentAddress: '', unitName: '',
        email: '', facebook: '', citizenId: '',
        citizenFront: null, citizenBack: null, staffPhoto: null,
        position: '', workType: '', startDate: '', role: '',
        department: '', memberOf: '', workPlace: '',
        vehiclePlate: '', joinInternalGroup: '', vpBankAccount: '',
        vpBankNumber: '', vpBankBranch: '', confirm: false,
    });
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [pendingSubmit, setPendingSubmit] = React.useState(false);

    const capitalizeName = (name) => {
        if (!name) return '';
        return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleNameBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'fullName') {
            setForm(prev => ({ ...prev, fullName: capitalizeName(value) }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        if (type === 'file' && files[0]) {
            setForm((prev) => ({ ...prev, [name]: files[0] }));
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreview((prev) => ({ ...prev, [name]: ev.target.result }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const validateForm = (formData) => {
        const errors = [];
        const today = dayjs();
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('• Địa chỉ Email không hợp lệ.');
        }
        if (formData.phone && !/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.phone)) {
            errors.push('• Số điện thoại không hợp lệ.');
        }
        if (formData.facebook && !/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/.test(formData.facebook)) {
            errors.push('• Link Facebook không đúng định dạng.');
        }
        if (formData.dob) {
            const dobDate = dayjs(formData.dob, 'DD/MM/YYYY', true);
            if (!dobDate.isValid()) {
                errors.push('• Ngày sinh không hợp lệ (sai ngày, tháng, hoặc năm nhuận).');
            } else if (dobDate.isAfter(today, 'day')) {
                errors.push('• Ngày sinh không thể là một ngày trong tương lai.');
            }
        }
        if (formData.startDate) {
            const startDateDate = dayjs(formData.startDate, 'DD/MM/YYYY', true);
            if (!startDateDate.isValid()) {
                errors.push('• Ngày bắt đầu làm việc không hợp lệ.');
            } else if (startDateDate.isAfter(today, 'day')) {
                errors.push('• Ngày bắt đầu làm việc không thể là một ngày trong tương lai.');
            }
        }
        if (formData.citizenId && !/^\d{12}$/.test(formData.citizenId)) {
            errors.push('• Số Căn cước công dân phải là 12 chữ số.');
        }
        if (!formData.confirm) {
            errors.push('• Bạn phải tích vào ô cam đoan thông tin là đúng sự thật.');
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(form);
        if (validationErrors.length > 0) {
            alert("Vui lòng sửa các lỗi sau:\n\n" + validationErrors.join("\n"));
            return;
        }
        setOpenConfirm(true);
    };

    const handleConfirmSubmit = async () => {
        setOpenConfirm(false);
        setPendingSubmit(true);
        
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null) {
                formData.append(key, form[key]);
            }
        });

        try {
            const [res1, res2] = await Promise.all([
                fetch('https://hrm-server.aipencil.name.vn/hrminfo', {
                    method: 'POST',
                    body: formData
                }),
                fetch('https://n8n.aipencil.ai/webhook/dmdngb', {
                    method: 'POST',
                    body: formData
                })
            ]);

            let success = true;
            let msg = '';

            if (!res1.ok) {
                const text = await res1.text();
                success = false;
                msg += `API gốc lỗi! Status: ${res1.status}\nBody: ${text.slice(0, 200)}\n`;
            }

            if (!res2.ok) {
                const text = await res2.text();
                success = false;
                msg += `Webhook lỗi! Status: ${res2.status}\nBody: ${text.slice(0, 200)}`;
            }

            if (success) {
                alert('Đã gửi thông tin thành công tới đến công ty. Cảm ơn bạn!');
            } else {
                alert(`Gửi thông tin thất bại:\n${msg}`);
            }
        } catch (err) {
            alert(`Lỗi gửi dữ liệu: ${err.message}`);
        }
        setPendingSubmit(false);
    };
    const handleRemoveCitizenFront = () => { setForm(p => ({ ...p, citizenFront: null })); setPreview(p => ({ ...p, citizenFront: null })); };
    const handleRemoveCitizenBack = () => { setForm(p => ({ ...p, citizenBack: null })); setPreview(p => ({ ...p, citizenBack: null })); };
    const handleRemoveStaffPhoto = () => { setForm(p => ({ ...p, staffPhoto: null })); setPreview(p => ({ ...p, staffPhoto: null })); };

    const columnWrapperSx = { p: 2, border: '1.5px solid #c4b5fd', borderRadius: 3, background: 'rgba(248,245,255,0.8)' };
    const columnTitleSx = { fontSize: '22.5px', color: '#7c3aed', fontWeight: 900, mb: 3 };

    return (
        <Box sx={{
            minHeight: '100vh', width: '100vw', p: 0, m: 0,
            background: "url('/final1.png') center/cover no-repeat fixed"
        }}>
            <Box sx={{ width: '100%', textAlign: 'center', pt: 4, pb: 2 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(124,58,237,0.18)' }}>
                    THÔNG TIN NHÂN SỰ 10 GROUP
                </span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', pb: 4 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.95)', p: 2, borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '95vw',
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2
                    }}
                >
                    <Box sx={columnWrapperSx}>
                        <Typography sx={columnTitleSx}>
                            <span style={{ fontSize: 32, marginRight: 8 }}>👩‍💼</span>
                            THÔNG TIN CÁ NHÂN
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <input name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={handleChange} onBlur={handleNameBlur} required />
                            <CustomDateInput name="dob" value={form.dob} onChange={handleChange} placeholder="Ngày sinh (DD/MM/YYYY)" required />
                            <AnimatedDropdown
                                label="Giới tính"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Giới tính' },
                                    { value: 'Nam', label: 'Nam' },
                                    { value: 'Nữ', label: 'Nữ' },
                                    { value: 'Khác', label: 'Khác' }
                                ]}
                            />
                            <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} required />
                            <input name="permanentAddress" placeholder="Địa chỉ thường trú" value={form.permanentAddress} onChange={handleChange} required />
                            <input name="currentAddress" placeholder="Địa chỉ hiện tại" value={form.currentAddress} onChange={handleChange} required />
                            <input name="unitName" placeholder="Tên Đơn vị (VD: Đại học Bách khoa Hà Nội)" value={form.unitName} onChange={handleChange} required />
                            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
                            <input name="facebook" placeholder="Link Facebook" value={form.facebook} onChange={handleChange} required />
                            <input name="citizenId" placeholder="Số Căn cước công dân" value={form.citizenId} onChange={handleChange} required />
                            <FileUploadBox name="citizenFront" label="Ảnh CCCD mặt trước" helpText="Tải lên ảnh chụp rõ nét, không bị lóa, mất góc." previewUrl={preview.citizenFront} onRemove={handleRemoveCitizenFront} onChange={handleChange} />
                            <FileUploadBox name="citizenBack" label="Ảnh CCCD mặt sau" helpText="Tải lên ảnh chụp rõ nét, không bị lóa, mất góc." previewUrl={preview.citizenBack} onRemove={handleRemoveCitizenBack} onChange={handleChange} />
                        </Box>
                    </Box>
                    <Box sx={columnWrapperSx}>
                        <Typography sx={columnTitleSx}>
                            <span style={{ fontSize: 32, marginRight: 8 }}>💼</span>
                            THÔNG TIN CÔNG VIỆC
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <AnimatedDropdown
                                label="Chức danh"
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Chức danh' }, { value: 'Part-time thử việc', label: 'Part-time thử việc' }, { value: 'Part-time chính thức', label: 'Part-time chính thức' }, { value: 'Full-time thử việc', label: 'Full-time thử việc' }, { value: 'Full-time chính thức', label: 'Full-time chính thức' }, { value: 'Giảng viên/trợ giảng thử việc', label: 'Giảng viên/trợ giảng thử việc' }, { value: 'Giảng viên/trợ giảng chính thức', label: 'Giảng viên/trợ giảng chính thức' }
                                ]}
                            />
                            <CustomDateInput name="startDate" value={form.startDate} onChange={handleChange} placeholder="Ngày bắt đầu làm việc (DD/MM/YYYY)" required />
                            <AnimatedDropdown
                                label="Hình thức làm việc"
                                name="workType"
                                value={form.workType}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Hình thức làm việc' }, { value: 'Part time offline', label: 'Part time offline' }, { value: 'Part time online', label: 'Part time online' }, { value: 'Full time', label: 'Full time' }
                                ]}
                            />
                            <AnimatedDropdown
                                label="Thành viên trực thuộc"
                                name="memberOf"
                                value={form.memberOf}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Thành viên trực thuộc' }, { value: '10 Education - Tin học', label: '10 Education - Tin học' }, { value: '10 Education - IELTS', label: '10 Education - IELTS' }, { value: '10 Education - SAT', label: '10 Education - SAT' }, { value: '10 Education - Slide', label: '10 Education - Slide' }, { value: 'The TOEIC Lab', label: 'The TOEIC Lab' }, { value: 'Tiếng Trung 86 HSK', label: 'Tiếng Trung 86 HSK' }, { value: 'VSTEP PLUS', label: 'VSTEP PLUS' }, { value: 'APTIS One', label: 'APTIS One' }, { value: 'AI Pencil', label: 'AI Pencil' }, { value: 'GOUNI', label: 'GOUNI' }
                                ]}
                            />
                            <AnimatedDropdown
                                label="Phòng/ban"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Phòng/ban' }, { value: 'HR & Administrator Manager', label: 'HR & Administrator Manager' }, { value: 'IELTS Academic', label: 'IELTS Academic' }, { value: 'TOEIC Academic', label: 'TOEIC Academic' }, { value: 'Computer Science Academic', label: 'Computer Science Academic' }, { value: 'Chinese Academic', label: 'Chinese Academic' }, { value: 'APTIS Academic', label: 'APTIS Academic' }, { value: 'Marketing Sales', label: 'Marketing Sales' }, { value: 'Branding Marketing', label: 'Branding Marketing' }, { value: 'Customer Service', label: 'Customer Service' }, { value: 'Soc Son Town Branch (team Chị Nguyễn Khánh Linh)', label: 'Soc Son Town Branch (team Chị Nguyễn Khánh Linh)' }, { value: 'Business Center (team Chị Phạm Thị Thu Phương)', label: 'Business Center (team Chị Phạm Thị Thu Phương)' }, { value: 'HCM City Branch', label: 'HCM City Branch' }, { value: 'SAT Academic', label: 'SAT Academic' }, { value: 'VSTEP Academic', label: 'VSTEP Academic' }, { value: 'GOUNI Academic', label: 'GOUNI Academic' }
                                ]}
                            />
                            <AnimatedDropdown
                                label="Chức vụ"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Chức vụ' }, { value: 'Academic Director', label: 'Academic Director' }, { value: 'Trainer', label: 'Trainer' }, { value: 'Teaching Assistant', label: 'Teaching Assistant' }, { value: 'Operations Director', label: 'Operations Director' }, { value: 'Manager', label: 'Manager' }, { value: 'Deputy Manager', label: 'Deputy Manager' }, { value: 'Leader', label: 'Leader' }, { value: 'Sub leader', label: 'Sub leader' }, { value: 'Staff', label: 'Staff' }, { value: 'Intern', label: 'Intern' }, { value: 'Branch Director', label: 'Branch Director' }, { value: 'Internal Accountant', label: 'Internal Accountant' }, { value: 'Tax Accountant', label: 'Tax Accountant' }, { value: 'Developer', label: 'Developer' }
                                ]}
                            />
                            <AnimatedDropdown
                                label="Nơi làm việc"
                                name="workPlace"
                                value={form.workPlace}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Nơi làm việc' }, { value: 'Sóc Sơn - Hà Nội', label: 'Sóc Sơn - Hà Nội' }, { value: '158-160 Nhật Tảo - TP.HCM', label: '158-160 Nhật Tảo - TP.HCM' }, { value: '295 Thanh Nhàn - Hà Nội', label: '295 Thanh Nhàn - Hà Nội' }, { value: '197 Trần Phú, Hà Đông - Hà Nội', label: '197 Trần Phú, Hà Đông - Hà Nội' }
                                ]}
                            />
                            {form.workPlace === '295 Thanh Nhàn - Hà Nội' && (<input name="vehiclePlate" placeholder="Biển số xe (chỉ cho nhân sự 295 Thanh Nhàn)" value={form.vehiclePlate} onChange={handleChange} />)}
                            <Box>
                                <Box display="flex" alignItems="center">
                                    <input type="checkbox" name="joinInternalGroup" checked={form.joinInternalGroup} onChange={handleChange} required style={{ marginRight: 8, transform: 'scale(1.2)' }} />
                                    <span style={{ fontSize: 16 }}>Tôi đã tham gia <a href="https://www.facebook.com/share/g/1C12xrUAkm/" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600 }}>Bản tin Nội bộ 10 Group</a> và follow <a href="https://www.instagram.com/10nhohon3/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', fontWeight: 600 }}>Instagram 10nhohon3</a>.</span>
                                </Box>
                                <Typography variant="caption" sx={{ display: 'block', pl: '22px', pt: '4px', fontSize: '13px', color: '#6b7280' }}>
                                Đây là 2 kênh thông tin chính thống của công ty mà người lao động cần nắm bắt thông tin. Hãy bấm tham gia và follow trước khi trả lời câu hỏi này.
                                </Typography>
                            </Box>
                            <FileUploadBox name="staffPhoto" label="Ảnh làm thẻ nhân viên" helpText="Ảnh chân dung rõ mặt, nền trắng, JPG/PNG, dưới 25MB." previewUrl={preview.staffPhoto} onRemove={handleRemoveStaffPhoto} onChange={handleChange} />
                        </Box>
                    </Box>
                    <Box sx={{ gridColumn: '1 / span 2', ...columnWrapperSx }}>
                        <Typography sx={columnTitleSx}><span style={{ fontSize: 32, marginRight: 8 }}>🏦</span>THÔNG TIN TÀI KHOẢN NGÂN HÀNG</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <AnimatedDropdown
                                label="Tình trạng tài khoản VPBank"
                                name="vpBankAccount"
                                value={form.vpBankAccount}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: '', label: 'Tình trạng tài khoản VPBank' }, { value: 'Chưa có hoặc đã có và muốn tạo tài khoản mới', label: 'Chưa có hoặc đã có và muốn tạo tài khoản mới' }, { value: 'Đã có tài khoản VP Bank', label: 'Đã có tài khoản VP Bank' }
                                ]}
                            />
                            {form.vpBankAccount === 'Đã có tài khoản VP Bank' && (
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <input name="vpBankNumber" placeholder="Số tài khoản VP Bank" value={form.vpBankNumber || ''} onChange={handleChange} required />
                                    <input name="vpBankBranch" placeholder="Chi nhánh VP Bank" value={form.vpBankBranch || ''} onChange={handleChange} required />
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ gridColumn: '1 / span 2' }}>
                        <input type="checkbox" name="confirm" checked={form.confirm} onChange={handleChange} required style={{ marginRight: 8, transform: 'scale(1.2)' }} />
                        <Typography variant="body1" color="textPrimary">Tôi cam đoan các thông tin khai trên là đúng sự thật và sẽ chịu trách nhiệm trước pháp luật nếu có hành vi làm giả giấy tờ/khai thông tin không đúng sự thật.</Typography>
                    </Box>
                    <Box textAlign="center" sx={{ gridColumn: '1 / span 2' }}>
                        <button
                            type="submit"
                            style={{ background: '#a78bfa', color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}
                            disabled={pendingSubmit}
                        >
                            {pendingSubmit ? 'Đang gửi...' : 'Gửi thông tin'}
                        </button>
                    </Box>
                    <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                        <DialogTitle sx={{ fontWeight: 700, color: '#7c3aed' }}>Xác nhận gửi thông tin</DialogTitle>
                        <DialogContent>
                            <Typography sx={{ mb: 2 }}>Hãy đảm bảo những thông tin bạn nhập vào đã chính xác.<br />Bạn có chắc chắn muốn nộp thông tin này?</Typography>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                            <Button onClick={() => setOpenConfirm(false)} variant="outlined" color="secondary" sx={{ minWidth: 120, borderRadius: 2, fontWeight: 600 }}>Quay lại</Button>
                            <Button onClick={handleConfirmSubmit} variant="contained" color="secondary" sx={{ minWidth: 120, borderRadius: 2, fontWeight: 600 }}>Xác nhận</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
}