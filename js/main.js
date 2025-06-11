// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()
		const target = document.querySelector(this.getAttribute('href'))
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	})
})

// Header background change on scroll
window.addEventListener('scroll', function () {
	const header = document.querySelector('.header')
	if (window.scrollY > 100) {
		header.style.background = 'rgba(220, 38, 38, 0.95)'
		header.style.backdropFilter = 'blur(20px)'
	} else {
		header.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
		header.style.backdropFilter = 'blur(10px)'
	}
})

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle')
const navMenu = document.querySelector('.nav-menu')

mobileMenuToggle.addEventListener('click', function () {
	mobileMenuToggle.classList.toggle('active')
	navMenu.classList.toggle('active')
})

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-menu a').forEach(link => {
	link.addEventListener('click', function () {
		mobileMenuToggle.classList.remove('active')
		navMenu.classList.remove('active')
	})
})

// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
	if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
		mobileMenuToggle.classList.remove('active')
		navMenu.classList.remove('active')
	}
})

// Form submission
document.querySelector('form').addEventListener('submit', function (e) {
	e.preventDefault()
	alert('Dziękujemy za zapytanie! Skontaktujemy się z Tobą w ciągu 24 godzin.')
})

// Add animation on scroll
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px',
}

const observer = new IntersectionObserver(function (entries) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = '1'
			entry.target.style.transform = 'translateY(0)'
		}
	})
}, observerOptions)

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
	card.style.opacity = '0'
	card.style.transform = 'translateY(30px)'
	card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
	observer.observe(card)
})

// Counter animation for stats
function animateCounter(element) {
	const target = parseInt(element.dataset.target)
	const suffix = element.dataset.suffix
	const duration = 2000 // 2 seconds
	const step = target / (duration / 16) // 60 fps
	let current = 0

	const timer = setInterval(() => {
		current += step
		if (current >= target) {
			current = target
			clearInterval(timer)
		}

		element.textContent = Math.floor(current) + suffix

		// Add pulsing effect during animation
		element.style.transform = 'scale(1.1)'
		setTimeout(() => {
			element.style.transform = 'scale(1)'
		}, 100)
	}, 16)
}

// Stats counter observer
const statsObserver = new IntersectionObserver(
	function (entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
				entry.target.classList.add('animated')
				animateCounter(entry.target)
			}
		})
	},
	{
		threshold: 0.5,
		rootMargin: '0px 0px -100px 0px',
	}
)

// Observe stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
	stat.style.transition = 'transform 0.1s ease'
	statsObserver.observe(stat)
})

// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
	question.addEventListener('click', function () {
		const faqItem = this.closest('.faq-item')
		const isActive = faqItem.classList.contains('active')

		// Close all FAQ items
		document.querySelectorAll('.faq-item').forEach(item => {
			item.classList.remove('active')
		})

		// Open clicked item if it wasn't active
		if (!isActive) {
			faqItem.classList.add('active')
		}
	})
})

// LPG Calculator functionality
function calculateSavings() {
	const fuelPrice = parseFloat(document.getElementById('fuel-price').value) || 0
	const lpgPrice = parseFloat(document.getElementById('lpg-price').value) || 0
	const consumption = parseFloat(document.getElementById('consumption').value) || 0
	const monthlyKm = parseInt(document.getElementById('monthly-km').value) || 0
	const installationCost = parseInt(document.getElementById('installation-cost').value) || 0

	// Validate inputs
	if (fuelPrice <= 0 || lpgPrice <= 0 || consumption <= 0 || monthlyKm <= 0) {
		document.getElementById('monthly-savings').textContent = '0 zł'
		document.getElementById('yearly-savings').textContent = '0 zł'
		document.getElementById('payback-time').textContent = '∞ miesięcy'
		document.getElementById('percentage-savings').textContent = '0%'
		return
	}

	// LPG consumption is typically 15% higher
	const lpgConsumption = consumption * 1.15

	// Calculate costs per 100km
	const fuelCostPer100km = consumption * fuelPrice
	const lpgCostPer100km = lpgConsumption * lpgPrice

	// Calculate savings per 100km
	const savingsPer100km = fuelCostPer100km - lpgCostPer100km

	// If no savings, show appropriate message
	if (savingsPer100km <= 0) {
		document.getElementById('monthly-savings').textContent = '0 zł'
		document.getElementById('yearly-savings').textContent = '0 zł'
		document.getElementById('payback-time').textContent = 'Brak oszczędności'
		document.getElementById('percentage-savings').textContent = '0%'
		return
	}

	// Calculate monthly and annual savings
	const monthlySavings = (savingsPer100km * monthlyKm) / 100
	const yearlySavings = monthlySavings * 12

	// Calculate payback time in months
	const paybackMonths = monthlySavings > 0 ? installationCost / monthlySavings : Infinity

	// Calculate percentage savings
	const percentageSavings = (savingsPer100km / fuelCostPer100km) * 100

	// Update results with proper formatting
	document.getElementById('monthly-savings').textContent = monthlySavings.toFixed(0) + ' zł'
	document.getElementById('yearly-savings').textContent = yearlySavings.toFixed(0) + ' zł'

	if (paybackMonths === Infinity || paybackMonths > 999) {
		document.getElementById('payback-time').textContent = '∞ miesięcy'
	} else {
		document.getElementById('payback-time').textContent = paybackMonths.toFixed(1) + ' miesięcy'
	}

	document.getElementById('percentage-savings').textContent = percentageSavings.toFixed(1) + '%'

	// Add animation to results
	document.querySelectorAll('.result-value').forEach(element => {
		element.style.transform = 'scale(1.1)'
		element.style.color = '#dc2626'
		setTimeout(() => {
			element.style.transform = 'scale(1)'
		}, 300)
	})
}

// Auto-calculate on input change
document.querySelectorAll('#fuel-price, #lpg-price, #consumption, #monthly-km, #installation-cost').forEach(input => {
	input.addEventListener('input', calculateSavings)
})

// Initial calculation
calculateSavings()
