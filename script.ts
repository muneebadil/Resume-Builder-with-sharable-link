
const form = document.getElementById('resumeForm') as HTMLFormElement;
const resumeOutput = document.getElementById('resumeOutput') as HTMLDivElement;
const shareSection = document.getElementById('shareSection') as HTMLDivElement;
const shareLink = document.getElementById('shareLink') as HTMLInputElement;
const copyLinkBtn = document.getElementById('copyLink') as HTMLButtonElement;
const downloadPdfBtn = document.getElementById('downloadPdf') as HTMLButtonElement;

let profileImageDataURL: string | null = null;


const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject('Error reading image file');
        };
        reader.readAsDataURL(file);
    });
};


const generateUniqueURL = (username: string): string => {
    return `https://your-app.vercel.app/${username}/resume`; // Simulating unique URL
};


const generateResume = async (event: Event) => {
    event.preventDefault(); // Prevent form submission

    
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const education = (document.getElementById('education') as HTMLTextAreaElement).value;
    const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
    const skills = (document.getElementById('skills') as HTMLTextAreaElement).value;

   
    const imageInput = document.getElementById('profileImage') as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
        try {
            profileImageDataURL = await handleImageUpload(imageInput.files[0]);
        } catch (error) {
            alert(error); // Alert the user about the error (e.g., large image)
            profileImageDataURL = null;
        }
    }


    const resumeHTML = `
        <h2>Resume</h2>
        ${profileImageDataURL ? `<img src="${profileImageDataURL}" alt="Profile Image">` : ''}
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <h3>Education</h3>
        <p>${education.replace(/\n/g, '<br>')}</p>
        <h3>Experience</h3>
        <p>${experience.replace(/\n/g, '<br>')}</p>
        <h3>Skills</h3>
        <p>${skills.replace(/\n/g, '<br>')}</p>
    `;

    
    resumeOutput.innerHTML = resumeHTML;

  
    shareSection.style.display = 'block';
    shareLink.value = generateUniqueURL(username);
};

// Event listener for form submission
form.addEventListener('submit', generateResume);

copyLinkBtn.addEventListener('click', () => {
    shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
});


downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.html(resumeOutput, {
        callback: function (pdf) {
            pdf.save('resume.pdf');
        }
    });
});
