import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, Heart, Brain, Star, Users, Shield, ChevronRight, Sparkles, Zap, Globe, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Add scroll-based animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms analyze 50+ lifestyle factors to find your perfect neighborhood match across Indian cities.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: Map,
      title: 'Interactive Discovery',
      description: 'Immersive maps with real-time data, street-level imagery, and comprehensive amenity analysis for informed decisions.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Heart,
      title: 'Personalized Insights',
      description: 'Tailored recommendations based on your work style, family needs, and lifestyle preferences in the Indian context.',
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50'
    },
    {
      icon: Shield,
      title: 'Data-Driven Security',
      description: 'Comprehensive safety analytics, crime statistics, and community insights for peace of mind in your new neighborhood.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer, Bangalore',
      content: 'NeighborFit transformed my house hunting experience. The AI recommendations were spot-on, and I found my dream neighborhood in just 2 weeks!',
      rating: 5,
      avatar: 'PS',
      company: 'Google'
    },
    {
      name: 'Rahul Mehta',
      role: 'Marketing Director, Mumbai',
      content: 'The commute analysis and safety insights were incredible. Found the perfect balance between work proximity and family-friendly amenities.',
      rating: 5,
      avatar: 'RM',
      company: 'Microsoft'
    },
    {
      name: 'Anjali Patel',
      role: 'Teacher, Delhi',
      content: 'As a new mom, the school ratings and park proximity features were game-changers. Highly recommend for families!',
      rating: 5,
      avatar: 'AP',
      company: 'DPS'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Users', icon: Users },
    { number: '200+', label: 'Neighborhoods', icon: Map },
    { number: '15+', label: 'Cities Covered', icon: Globe },
    { number: '95%', label: 'Success Rate', icon: Award }
  ];

  const steps = [
    {
      step: '01',
      title: 'Share Your Vision',
      description: 'Tell us about your lifestyle, work requirements, and what matters most to you in your ideal neighborhood.',
      icon: Heart
    },
    {
      step: '02',
      title: 'AI Magic Happens',
      description: 'Our advanced algorithms analyze thousands of data points to find neighborhoods that perfectly align with your needs.',
      icon: Brain
    },
    {
      step: '03',
      title: 'Discover & Decide',
      description: 'Explore detailed insights, interactive maps, and comprehensive data to make your final decision with confidence.',
      icon: Map
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100 relative overflow-hidden">
      {/* Premium Background Elements - Consistent with Dashboard/Explore */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 via-purple-50/20 to-pink-50/30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">AI-Powered Neighborhood Discovery</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Neighborhood
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover neighborhoods across Indian cities that align with your lifestyle through 
            <span className="font-semibold text-slate-800"> AI-powered insights</span> and 
            <span className="font-semibold text-slate-800"> personalized recommendations</span>
          </p>

          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden"
              onClick={handleGetStarted}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <Link
              to="/explore"
              className="group bg-white/80 backdrop-blur-md text-slate-700 font-semibold text-lg px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Explore Neighborhoods
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-indigo-600 mr-2" />
                  <span className="text-3xl md:text-4xl font-bold text-slate-900">{stat.number}</span>
                </div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Premium Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> NeighborFit</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We combine cutting-edge AI with comprehensive neighborhood data to help you make 
              the most important decision of where to call home in India.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${feature.bgGradient} p-8 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:scale-105 overflow-hidden`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              How It
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Three simple steps to finding your perfect neighborhood match in India
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 transform translate-x-4"></div>
                )}

                {/* Step Card */}
                <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:scale-105 text-center">
                  {/* Step Number */}
                  <div className="relative w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>

                  {/* Step Icon */}
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-indigo-600" />
                  </div>

                  {/* Step Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-lg">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">User Stories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              What Our
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Users Say</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of happy users who found their perfect neighborhood across India
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:scale-105">
                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-slate-600">{testimonial.role}</p>
                    <p className="text-sm text-indigo-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-16 rounded-3xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
            
            {/* Content */}
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Find Your
                <br />Perfect Neighborhood?
              </h2>
              <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
                Join thousands of Indians who have found their ideal community with NeighborFit's AI-powered recommendations
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  className="group bg-white text-indigo-600 font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  onClick={handleGetStarted}
                >
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <Link
                  to="/explore"
                  className="group bg-white/20 backdrop-blur-md text-white font-semibold text-lg px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
                >
                  Explore First
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;