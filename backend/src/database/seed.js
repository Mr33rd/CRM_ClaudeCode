const db = require('../models');
const { User, Student, Session, BeltProgression, Assessment, Payment, Graduation, Attendance } = db;

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample data...\n');

    // Create admin user
    const admin = await User.create({
      email: 'admin@trenttactical.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin'
    });
    console.log('✓ Admin user created');

    // Create instructor user
    const instructor = await User.create({
      email: 'instructor@trenttactical.com',
      password: 'instructor123',
      firstName: 'John',
      lastName: 'Instructor',
      phone: '+1234567891',
      role: 'instructor'
    });
    console.log('✓ Instructor user created');

    // Create sample students
    const students = [];

    // Student 1 - Active, White Belt
    const student1User = await User.create({
      email: 'student1@example.com',
      password: 'student123',
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '+1234567892',
      role: 'student'
    });

    const student1 = await Student.create({
      userId: student1User.id,
      currentBeltLevel: 'white',
      status: 'active',
      dateOfBirth: new Date('1990-05-15'),
      address: '123 Main St',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      emergencyContactName: 'Bob Johnson',
      emergencyContactPhone: '+1234567893',
      emergencyContactRelationship: 'Spouse',
      backgroundCheckStatus: 'approved'
    });

    students.push(student1);

    // Create graduation record for student1
    await Graduation.create({
      studentId: student1.id,
      eligibilityStatus: 'not_eligible'
    });

    // Create payments for student1
    for (let month = 1; month <= 6; month++) {
      const dueDate = new Date(student1.enrollmentDate);
      dueDate.setMonth(dueDate.getMonth() + month - 1);

      await Payment.create({
        studentId: student1.id,
        amount: 225.00,
        month,
        dueDate,
        status: month === 1 ? 'paid' : 'pending',
        paidDate: month === 1 ? new Date() : null,
        paymentMethod: month === 1 ? 'credit_card' : null
      });
    }

    console.log('✓ Student 1 created (White Belt)');

    // Student 2 - Active, Blue Belt (almost graduating)
    const student2User = await User.create({
      email: 'student2@example.com',
      password: 'student123',
      firstName: 'Michael',
      lastName: 'Smith',
      phone: '+1234567894',
      role: 'student'
    });

    const enrollmentDate2 = new Date();
    enrollmentDate2.setMonth(enrollmentDate2.getMonth() - 5);

    const student2 = await Student.create({
      userId: student2User.id,
      currentBeltLevel: 'blue',
      status: 'active',
      enrollmentDate: enrollmentDate2,
      dateOfBirth: new Date('1985-08-22'),
      address: '456 Oak Ave',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85002',
      emergencyContactName: 'Sarah Smith',
      emergencyContactPhone: '+1234567895',
      emergencyContactRelationship: 'Spouse',
      backgroundCheckStatus: 'approved'
    });

    students.push(student2);

    // Create belt progressions for student2
    const belts = ['white', 'yellow', 'orange', 'red', 'blue'];
    for (let i = 0; i < belts.length; i++) {
      const achievedDate = new Date(enrollmentDate2);
      achievedDate.setMonth(achievedDate.getMonth() + i);

      await BeltProgression.create({
        studentId: student2.id,
        beltLevel: belts[i],
        achievedDate,
        testScore: 85 + Math.random() * 10,
        testPassed: true,
        instructorId: instructor.id
      });
    }

    // Create graduation record for student2
    await Graduation.create({
      studentId: student2.id,
      eligibilityStatus: 'not_eligible',
      allBeltsCompleted: false,
      allPaymentsCompleted: false
    });

    // Create payments for student2 (5 paid, 1 pending)
    for (let month = 1; month <= 6; month++) {
      const dueDate = new Date(enrollmentDate2);
      dueDate.setMonth(dueDate.getMonth() + month - 1);

      await Payment.create({
        studentId: student2.id,
        amount: 225.00,
        month,
        dueDate,
        status: month <= 5 ? 'paid' : 'pending',
        paidDate: month <= 5 ? dueDate : null,
        paymentMethod: month <= 5 ? 'credit_card' : null
      });
    }

    console.log('✓ Student 2 created (Blue Belt)');

    // Student 3 - Graduated
    const student3User = await User.create({
      email: 'student3@example.com',
      password: 'student123',
      firstName: 'Emily',
      lastName: 'Davis',
      phone: '+1234567896',
      role: 'student'
    });

    const enrollmentDate3 = new Date();
    enrollmentDate3.setMonth(enrollmentDate3.getMonth() - 6);

    const student3 = await Student.create({
      userId: student3User.id,
      currentBeltLevel: 'black',
      status: 'graduated',
      enrollmentDate: enrollmentDate3,
      actualGraduationDate: new Date(),
      dateOfBirth: new Date('1992-03-10'),
      address: '789 Pine Rd',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85003',
      emergencyContactName: 'Tom Davis',
      emergencyContactPhone: '+1234567897',
      emergencyContactRelationship: 'Brother',
      backgroundCheckStatus: 'approved'
    });

    students.push(student3);

    // Create all belt progressions for student3
    const allBelts = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    for (let i = 0; i < allBelts.length; i++) {
      const achievedDate = new Date(enrollmentDate3);
      achievedDate.setMonth(achievedDate.getMonth() + i);

      await BeltProgression.create({
        studentId: student3.id,
        beltLevel: allBelts[i],
        achievedDate,
        testScore: 88 + Math.random() * 10,
        testPassed: true,
        instructorId: instructor.id
      });
    }

    // Create graduation record for student3
    await Graduation.create({
      studentId: student3.id,
      eligibilityStatus: 'graduated',
      allBeltsCompleted: true,
      allPaymentsCompleted: true,
      allAssessmentsPassed: true,
      finalExamScore: 92.5,
      finalExamPassed: true,
      graduationDate: new Date(),
      firearmSelection: 'glock_17_19_elite',
      firearmDeliveryStatus: 'delivered',
      firearmDeliveryDate: new Date(),
      certificateNumber: `MAD-CERT-${Date.now()}-0001`,
      ceremonyAttended: true
    });

    // Create all payments as paid for student3
    for (let month = 1; month <= 6; month++) {
      const dueDate = new Date(enrollmentDate3);
      dueDate.setMonth(dueDate.getMonth() + month - 1);

      await Payment.create({
        studentId: student3.id,
        amount: 225.00,
        month,
        dueDate,
        status: 'paid',
        paidDate: dueDate,
        paymentMethod: 'credit_card'
      });
    }

    console.log('✓ Student 3 created (Graduated)');

    // Create sample sessions
    const today = new Date();

    // Past session
    const pastSession = await Session.create({
      sessionName: 'White Band - Fundamentals Training',
      sessionType: 'regular_training',
      beltLevel: 'white',
      sessionDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      startTime: '09:00:00',
      endTime: '12:00:00',
      location: 'Trent Tactical Range',
      instructorId: instructor.id,
      maxCapacity: 15,
      currentEnrollment: 2,
      status: 'completed',
      description: 'Introduction to firearm fundamentals and safety'
    });

    // Upcoming session
    const upcomingSession = await Session.create({
      sessionName: 'Blue Band - Low Light Training',
      sessionType: 'regular_training',
      beltLevel: 'blue',
      sessionDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      startTime: '14:00:00',
      endTime: '17:00:00',
      location: 'Trent Tactical Range',
      instructorId: instructor.id,
      maxCapacity: 10,
      currentEnrollment: 1,
      status: 'scheduled',
      description: 'Advanced low-light shooting techniques'
    });

    console.log('✓ Training sessions created');

    // Create sample attendance
    await Attendance.create({
      studentId: student1.id,
      sessionId: pastSession.id,
      status: 'present',
      checkInTime: new Date(pastSession.sessionDate.getTime() + 9 * 60 * 60 * 1000),
      checkOutTime: new Date(pastSession.sessionDate.getTime() + 12 * 60 * 60 * 1000)
    });

    await Attendance.create({
      studentId: student2.id,
      sessionId: pastSession.id,
      status: 'present',
      checkInTime: new Date(pastSession.sessionDate.getTime() + 9 * 60 * 60 * 1000),
      checkOutTime: new Date(pastSession.sessionDate.getTime() + 12 * 60 * 60 * 1000)
    });

    console.log('✓ Attendance records created');

    // Create sample assessments
    await Assessment.create({
      studentId: student1.id,
      beltLevel: 'white',
      assessmentType: 'skills_test',
      assessmentDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      score: 85.5,
      passed: true,
      attemptNumber: 1,
      instructorId: instructor.id,
      feedback: 'Good understanding of fundamentals. Keep practicing trigger control.',
      strengths: 'Excellent safety awareness and grip technique',
      areasForImprovement: 'Work on sight alignment'
    });

    console.log('✓ Assessment records created');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('Sample credentials:');
    console.log('  Admin:      admin@trenttactical.com / admin123');
    console.log('  Instructor: instructor@trenttactical.com / instructor123');
    console.log('  Student 1:  student1@example.com / student123 (White Belt)');
    console.log('  Student 2:  student2@example.com / student123 (Blue Belt)');
    console.log('  Student 3:  student3@example.com / student123 (Graduated)\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
