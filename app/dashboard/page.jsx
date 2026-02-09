'use client'

// Disable static generation for this component
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import {
    User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Briefcase, Building,
    ShieldCheck, Clock, CheckCircle, AlertCircle, FileText, ChevronRight,
    Menu, X as XIcon
} from 'lucide-react'
import { getEmployeeById, updateEmployeeProfile } from '@/app/api/employees'
import { useAuth } from '@/app/utils/authContext'

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchProfile()
        }
    }, [user])

    const fetchProfile = async () => {
        if (!user) {
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const employeeId = user.employeeProfile?.[0]?.id || user.employeeId || user.id

            if (!employeeId) {
                setLoading(false)
                return
            }

            const response = await getEmployeeById(employeeId)

            if (response.employee) {
                const employeeData = response.employee
                const formattedProfile = {
                    id: employeeData.id,
                    firstName: employeeData.firstName || employeeData.name.split(' ')[0],
                    lastName: employeeData.lastName || employeeData.name.split(' ').slice(1).join(' '),
                    name: employeeData.name,
                    department: employeeData.department,
                    jobTitle: employeeData.jobTitle,
                    status: employeeData.status,
                    leaveSummary: response.leaveSummary || [],
                    leaveApplications: response.leaveApplications || [],
                    employeeId: `EMP-${employeeData.id.toString().padStart(5, '0')}`,
                    email: user?.email || '',
                    phone: user?.phone || '',
                    dateOfBirth: '1990-01-01',
                    gender: user?.gender || 'male',
                    contractType: 'full_time',
                    manager: 'Manager Name',
                    reportsTo: 'EMP-004',
                    hireDate: new Date().toISOString().split('T')[0],
                    createdAt: new Date().toISOString()
                }
                setProfile(formattedProfile)
                setFormData(formattedProfile)
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching profile:', error)
            setLoading(false)
        }
    }

    const handleEdit = () => {
        setEditing(true)
        setFormData(profile || {})
    }

    const handleCancel = () => {
        setEditing(false)
    }

    const handleSave = async () => {
        if (!profile || !user) return

        try {
            const updateData = {
                name: `${formData.firstName} ${formData.lastName}`,
                department: formData.department || '',
                jobTitle: formData.jobTitle || '',
                status: formData.status || 'active',
            }

            await updateEmployeeProfile(profile.id, updateData)

            setProfile({ ...profile, ...formData, name: updateData.name })
            setEditing(false)
            alert('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen md:min-h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    if (!profile && !loading) {
        return (
            <div className="text-center py-10 md:py-20 px-4">
                <div className="bg-gray-100 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm md:text-base">We couldn't retrieve your employee profile. Please try refreshing or contact support.</p>
                <button
                    onClick={fetchProfile}
                    className="px-4 py-2 md:px-6 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium text-sm md:text-base"
                >
                    Retry Connection
                </button>
            </div>
        )
    }

    if (!profile) return null

    const greetUser = () => {
        const hour = new Date().getHours()
        if (hour < 12) {
            return 'Good Morning'
        } else if (hour < 18) {
            return 'Good Afternoon'
        } else {
            return 'Good Evening'
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-50 min-h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
            >
                {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* --- Header Section --- */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-green-50 rounded-full -mr-16 md:-mr-32 -mt-16 md:-mt-32 opacity-50 blur-3xl pointer-events-none"></div>

                <div className="relative flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg text-white text-xl md:text-3xl font-bold">
                                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white flex items-center justify-center ${profile.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    {profile.status === 'active' ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" /> : <Clock className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                                </div>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                                    {greetUser()},
                                    <span className="ml-1 md:ml-2 text-green-600 block sm:inline">
                                        {profile.firstName} {profile.lastName}
                                    </span>
                                </h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-xs md:text-sm">
                                        <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        {profile.jobTitle}
                                    </span>
                                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-xs md:text-sm">
                                        <Building className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                        {profile.department}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        {!editing ? (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm text-sm md:text-base w-full sm:w-auto justify-center"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 transition-all font-medium text-sm md:text-base justify-center flex-1 sm:flex-none"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-green-600 text-white rounded-lg md:rounded-xl hover:bg-green-700 shadow-md shadow-green-200 transition-all font-medium text-sm md:text-base justify-center flex-1 sm:flex-none"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
                {/* --- Left Column: Quick Stats & Contact --- */}
                <div className={`lg:col-span-3 space-y-4 md:space-y-6 lg:sticky lg:top-6 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
                    {/* Status Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Account Status
                            </h3>
                        </div>
                        <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <span className="text-sm text-gray-500">Employee ID</span>
                                <span className="text-xs md:text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{profile.employeeId}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <span className="text-sm text-gray-500">Status</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full ${profile.status === 'active'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                    {profile.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 last:border-0">
                                <span className="text-sm text-gray-500">Contract</span>
                                <span className="text-sm font-medium text-gray-900 capitalize">{profile.contractType.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-600" />
                                Contact Details
                            </h3>
                        </div>
                        <div className="p-4 md:p-5 space-y-4 md:space-y-5">
                            <ContactItem
                                icon={<Mail className="w-4 h-4" />}
                                label="Email Address"
                                value={profile.email}
                                isEditable={editing}
                                name="email"
                                onChange={handleChange}
                                formData={formData}
                            />
                            <ContactItem
                                icon={<Phone className="w-4 h-4" />}
                                label="Phone Number"
                                value={profile.phone || 'Not provided'}
                                isEditable={editing}
                                name="phone"
                                onChange={handleChange}
                                formData={formData}
                            />
                            <ContactItem
                                icon={<MapPin className="w-4 h-4" />}
                                label="Location"
                                value="Nairobi, Kenya"
                                isEditable={false}
                            />
                        </div>
                    </div>
                </div>

                {/* --- Center Column: Detailed Forms --- */}
                <div className="lg:col-span-6 space-y-4 md:space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                <User className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-base md:text-lg font-bold text-gray-500">Personal Information</h2>
                                <p className="text-xs md:text-sm text-gray-500">View and update your personal details</p>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <FormGroup label="First Name" id="firstName">
                                {editing ? (
                                    <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} className="form-input" />
                                ) : <div className="form-display">{profile.firstName}</div>}
                            </FormGroup>

                            <FormGroup label="Last Name" id="lastName">
                                {editing ? (
                                    <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="form-input" />
                                ) : <div className="form-display">{profile.lastName}</div>}
                            </FormGroup>

                            <FormGroup label="Date of Birth" id="dateOfBirth">
                                {editing ? (
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} className="form-input" />
                                ) : <div className="form-display">{formatDate(profile.dateOfBirth)}</div>}
                            </FormGroup>

                            <FormGroup label="Gender" id="gender">
                                {editing ? (
                                    <select name="gender" value={formData.gender || ''} onChange={handleChange} className="form-select">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                ) : <div className="form-display capitalize">{profile.gender}</div>}
                            </FormGroup>
                        </div>
                    </div>

                    {/* Employment Info */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-base md:text-lg font-bold text-gray-500">Employment Details</h2>
                                <p className="text-xs md:text-sm text-gray-500">Your role and department information</p>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <FormGroup label="Job Title" id="jobTitle">
                                {editing ? (
                                    <input type="text" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} className="form-input" />
                                ) : <div className="form-display">{profile.jobTitle}</div>}
                            </FormGroup>

                            <FormGroup label="Department" id="department">
                                {editing ? (
                                    <input type="text" name="department" value={formData.department || ''} onChange={handleChange} className="form-input" />
                                ) : <div className="form-display">{profile.department}</div>}
                            </FormGroup>

                            <FormGroup label="Manager" id="manager">
                                <div className="form-display bg-gray-50">{profile.manager}</div>
                            </FormGroup>

                            <FormGroup label="Date Hired" id="hireDate">
                                <div className="form-display bg-gray-50 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {formatDate(profile.hireDate)}
                                </div>
                            </FormGroup>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Leave & Activity --- */}
                <div className="lg:col-span-3 space-y-4 md:space-y-6">
                    {/* Leave Summary Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-500">Leave Balance</h3>
                            <button className="text-xs font-medium text-green-600 hover:text-green-700">View All</button>
                        </div>

                        <div className="p-4 space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar">
                            {profile.leaveSummary && profile.leaveSummary.length > 0 ? (
                                profile.leaveSummary.map((leave, index) => (
                                    <div key={index} className="p-3 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-semibold text-gray-700 capitalize group-hover:text-green-700 transition-colors truncate mr-2">
                                                {leave.leaveTypeName.toLowerCase()}
                                            </span>
                                            <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600 whitespace-nowrap">
                                                {leave.remainingDays} left
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                                            <div
                                                className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((leave.usedDays / leave.allocatedDays) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{leave.usedDays} used</span>
                                            <span>{leave.allocatedDays} total</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No leave data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Requests Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-500">Recent Activity</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[250px] md:max-h-[300px] overflow-y-auto">
                            {profile.leaveApplications && profile.leaveApplications.length > 0 ? (
                                profile.leaveApplications.slice(0, 4).map((app, idx) => (
                                    <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-medium text-gray-900 truncate mr-2">{app.leaveType}</p>
                                            <StatusBadge status={app.status} />
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(app.startDate)} - {formatDate(app.endDate)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No recent applications found.
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                            <button className="text-xs font-medium text-gray-500 hover:text-green-600 transition-colors flex items-center justify-center gap-1 w-full">
                                View Full History <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .form-input {
                    @apply w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium text-gray-500;
                }
                .form-select {
                    @apply w-full px-3 py-2 md:px-4 md:py-2.5 bg-white border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium text-gray-500 appearance-none cursor-pointer;
                }
                .form-display {
                    @apply w-full px-3 py-2 md:px-4 md:py-2.5 bg-gray-50 rounded-lg md:rounded-xl border border-transparent text-sm font-medium text-gray-500;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e7eb;
                    border-radius: 20px;
                }
                
                /* Responsive breakpoints */
                @media (max-width: 640px) {
                    .form-input, .form-select, .form-display {
                        font-size: 14px;
                    }
                }
                
                @media (min-width: 640px) and (max-width: 1024px) {
                    .lg\:col-span-3, .lg\:col-span-6 {
                        grid-column: span 12;
                    }
                }
            `}</style>
        </div>
    )
}

// --- Helper Components ---

const FormGroup = ({ label, children, id }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-xs font-semibold text-gray-500 ml-1">
            {label}
        </label>
        <div className="relative text-gray-500">
            {children}
        </div>
    </div>
)

const ContactItem = ({ icon, label, value, isEditable, name, onChange, formData }) => (
    <div className="flex gap-3 items-start p-1">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 mt-0.5">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
            {isEditable ? (
                <input
                    type="text"
                    name={name}
                    value={formData[name] || ''}
                    onChange={onChange}
                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
            ) : (
                <p className="text-sm font-medium text-gray-500 break-words" title={value}>{value}</p>
            )}
        </div>
    </div>
)

const StatusBadge = ({ status }) => {
    const styles = {
        approved: 'bg-green-100 text-green-700 border-green-200',
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
    }
    const style = styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide whitespace-nowrap ${style}`}>
            {status}
        </span>
    )
}

export default ProfilePage