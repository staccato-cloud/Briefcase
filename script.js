// Startup JS code
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio page loaded and ready!');
});

class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        this.tabs = Array.from(document.querySelectorAll('.portfolio-tab'));
        this.tabContainer = document.querySelector('.portfolio-tabs-container');
        this.tabSlider = document.querySelector('.portfolio-tab-slider');
        this.heroTabs = document.querySelector('.portfolio-tabs');

        this.tabs.forEach(tab =>
            tab.addEventListener('click', event => this.onTabClick(event, tab))
        );
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
    }

    onTabClick(event, element) {
        event.preventDefault();
        const targetId = element.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const scrollTop = target.offsetTop - this.tabContainerHeight + 1;
            window.scrollTo({ top: scrollTop, behavior: 'smooth' });
            // Do NOT update active tab here!
        }
    }

    onScroll() {
        this.checkTabContainerPosition();
        this.findCurrentTabSelector();
    }

    onResize() {
        if (this.currentId) {
            this.setSliderCss();
        }
    }

    checkTabContainerPosition() {
        if (!this.heroTabs || !this.tabContainer) return;
        const offset = this.heroTabs.offsetTop + this.heroTabs.offsetHeight - this.tabContainerHeight;
        if (window.scrollY > offset) {
            this.tabContainer.classList.add('portfolio-tabs-container--top');
        } else {
            this.tabContainer.classList.remove('portfolio-tabs-container--top');
        }
    }

    findCurrentTabSelector() {
        let newCurrentId = null;
        let newCurrentTab = null;
        this.tabs.forEach(tab => {
            const id = tab.getAttribute('href');
            const section = document.querySelector(id);
            if (section) {
                const offsetTop = section.offsetTop - this.tabContainerHeight;
                const offsetBottom = section.offsetTop + section.offsetHeight - this.tabContainerHeight;
                if (window.scrollY > offsetTop && window.scrollY < offsetBottom) {
                    newCurrentId = id;
                    newCurrentTab = tab;
                }
            }
        });
        if (this.currentId !== newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.tabs.forEach(tab => tab.classList.remove('active'));
            if (this.currentTab) this.currentTab.classList.add('active');
            this.setSliderCss();
        }
    }

    setSliderCss() {
        if (this.currentTab && this.tabSlider && this.tabContainer) {
            const rect = this.currentTab.getBoundingClientRect();
            const containerRect = this.tabContainer.getBoundingClientRect();
            this.tabSlider.style.width = `${rect.width}px`;
            this.tabSlider.style.left = `${rect.left - containerRect.left}px`;
        }
    }
}

// Parallax and Unsplash API integration
document.addEventListener('DOMContentLoaded', () => {
    gsap.from(".portfolio-tabs-container .portfolio-tab", {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "opacity,transform"
    });
    gsap.from("main .portfolio-slide", {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out",
        clearProps: "opacity,transform"
    });

    new StickyNavigation();

    // Unsplash API setup
    const ACCESS_KEY = 'xviu9SkfMJLECV-lvlFcRPudbm5_H3woBSJAm49VCAM'; // Your Unsplash API key
    const sections = document.querySelectorAll('.portfolio-slide');
    const queries = ['nature', 'person', 'technology', 'contact'];

    // Set Unsplash background for each section
    sections.forEach((section, idx) => {
        fetch(`https://api.unsplash.com/photos/random?query=${queries[idx]}&orientation=landscape&client_id=${ACCESS_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.urls && data.urls.regular) {
                section.style.backgroundImage = `url('${data.urls.regular}')`;
                section.style.backgroundSize = 'cover';
                section.style.backgroundPosition = 'center';
                section.style.backgroundAttachment = 'fixed';
            }
        })
        .catch(() => {
            section.style.background = '#eee';
        });
    });

    // Parallax scroll effect
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const speed = 0.5;
            const offset = window.pageYOffset - section.offsetTop;
            section.style.backgroundPositionY = `${offset * speed}px`;
        });
    });
});