import { motion } from 'framer-motion';
import { Users, Brain, Cpu, Rocket, Code, Database, Globe, Award } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const team = [
  {
    name: 'Priya Sharma',
    role: 'AI/ML Lead',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    bio: 'PhD in Computer Vision from IISc. Led AI teams at Google and Microsoft.',
  },
  {
    name: 'Arjun Reddy',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    bio: 'Ex-Amazon SDE. Specialist in high-performance web applications.',
  },
  {
    name: 'Sneha Patel',
    role: 'Data Scientist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
    bio: 'MSc Statistics from ISI. Expert in real estate market analytics.',
  },
  {
    name: 'Rahul Menon',
    role: 'Backend Architect',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    bio: 'Ex-Flipkart. Designed systems handling 1M+ daily transactions.',
  },
];

const techStack = [
  { icon: Brain, name: 'ResNet18 CNN', description: 'Satellite image analysis' },
  { icon: Cpu, name: 'XGBoost', description: 'Price prediction model' },
  { icon: Code, name: 'FastAPI', description: 'High-performance API' },
  { icon: Database, name: 'PostgreSQL', description: 'Scalable data storage' },
  { icon: Globe, name: 'React + TypeScript', description: 'Modern frontend' },
  { icon: Rocket, name: 'Vercel Edge', description: 'Global deployment' },
];

const timeline = [
  { date: 'Jan 2024', title: 'Project Inception', description: 'Identified the need for AI-powered property valuation in Bangalore' },
  { date: 'Mar 2024', title: 'Data Collection', description: 'Gathered 50K+ property records and satellite imagery' },
  { date: 'May 2024', title: 'Model Training', description: 'Trained CNN and XGBoost models achieving 95% accuracy' },
  { date: 'Jul 2024', title: 'Beta Launch', description: 'Released beta version to 1000+ users for testing' },
  { date: 'Sep 2024', title: 'Public Launch', description: 'VisionPrice goes live with full feature set' },
  { date: 'Dec 2024', title: 'Hackathon Entry', description: 'Showcasing at the 2024 AI Innovation Hackathon' },
];

const About = () => {
  return (
    <Layout>
      <section className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Building the Future of <span className="gradient-text">Property Intelligence</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're a team of AI researchers, engineers, and real estate experts on a mission to 
              democratize property valuation through cutting-edge technology.
            </p>
          </motion.div>

          {/* How AI Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 rounded-3xl mb-16"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-center">
              How Our <span className="gradient-text">AI Works</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: 1, title: 'Satellite Capture', description: 'High-res satellite imagery captures property and surroundings' },
                { step: 2, title: 'CNN Analysis', description: 'ResNet18 extracts visual features: greenery, roads, development' },
                { step: 3, title: 'Feature Fusion', description: 'Visual + tabular data (area, BHK, age) combined' },
                { step: 4, title: 'Price Prediction', description: 'XGBoost ensemble predicts price with 95% accuracy' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-0.5 bg-primary/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-center">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ rotateY: 180 }}
                  className="perspective-1000 cursor-pointer group h-80"
                >
                  <div className="relative w-full h-full preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden neu-card rounded-2xl overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-5 text-center">
                        <h3 className="font-display font-bold text-lg">{member.name}</h3>
                        <p className="text-primary text-sm">{member.role}</p>
                      </div>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <h3 className="font-display font-bold text-lg mb-2">{member.name}</h3>
                      <p className="text-primary text-sm mb-4">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-center">
              Our <span className="gradient-text">Tech Stack</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="neu-card p-4 rounded-xl text-center hover:shadow-glow transition-all duration-300"
                >
                  <tech.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-sm mb-1">{tech.name}</h4>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl mb-8 text-center">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.date}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="glass-card p-6 rounded-xl inline-block">
                        <span className="text-primary font-semibold text-sm">{item.date}</span>
                        <h4 className="font-display font-bold text-lg mt-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-primary shadow-glow flex-shrink-0" />
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
