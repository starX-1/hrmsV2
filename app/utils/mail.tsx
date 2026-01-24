const openEmailForOnboarding = () => {
    const email = "rcsolutions@gmail.com";
    const subject = encodeURIComponent("Company Onboarding Request - HRMS Pro");
    const body = encodeURIComponent(`Dear RC Solutions Team,

I would like to onboard my company to HRMS Pro. Please provide me with the necessary information to get started.

Company Information:
- Company Name: 
- Industry: 
- Approximate Number of Employees: 
- Contact Person: 
- Phone Number: 

Best regards,
[Your Name]`);

    // Open default email client
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
};

export default openEmailForOnboarding;